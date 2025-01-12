import uuid
from langchain_community.llms.tongyi import Tongyi
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
import xuexixitong.correct_QA.prompt.context as Context
import xuexixitong.correct_QA.prompt.sample as Sample
import xuexixitong.correct_QA.prompt.template as Template
from xuexixitong.correct_QA.utils.history import get_sync_connection, get_session_history_with_connection_info, runnable_with_history
import xuexixitong.correct_QA.utils.selector as selector
from xuexixitong.correct_QA.utils.Access_RAG import kb_chat
from xuexixitong.correct_QA.utils.theme import get_theme
import xuexixitong.Conversion as cv
from xuexixitong.Database.theme_store import insert_theme
from langchain_postgres import PostgresChatMessageHistory
import psycopg

from typing import Optional

DBinfo = r"dbname=postgres user=postgres password=root port=15432"
sync_connection = psycopg.connect(DBinfo)
table_name = "QA_history"
PostgresChatMessageHistory.create_tables(sync_connection, table_name)



def Basic_flow(input: str, 
               stage: int,
               step: int, 
               user_id: str, 
               conversation_id: str,
               user_answer: Optional[str] = None, 
               correct_answer: Optional[str] = None) -> str:
    
    
    # 链接数据库
    sync_connection = get_sync_connection(DBinfo)

    # 记录模式对话历史的数据库
    table_name = "QA_history"

    # 定义用于读取写入历史的函数
    get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name=table_name)
    
    # 定义模型
    model = Tongyi(
        model_name= 'qwen-turbo',
        temperature=0.7,
        api_key='',
    )    
    
    # 如果是第一轮对话，初始化对话
    if step == 1:
        #TODO 异常处理
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}"),
            ]
        )
        
        
        
        # 获取引导部分的上下文
        context = Context.instruction_context.format(
            template = Template.QA_template,
            example = Sample.instruction_sample,
            query = input,
            correct_answer = correct_answer,
            idx = step,
            input = user_answer
        )
    
    # 如果是第k次对话
    else:
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}"),
            ]
        )
        
        context = Context.move_on_context.format(
            idx = step,
            input = input
        )
    
    
    # 模型运行的链
    runnable = prompt | model
    
    # 定义运行函数
    run_with_history = runnable_with_history(
        runnable,
        get_session_history,
        input_key='context'   
    )
    
    # 对话
    response = run_with_history.invoke(
        {'context': context },
        config={"configurable": {"user_id": str(user_id), "conversation_id": str(conversation_id)}},
    )
    
    
    return response
    

def first_flow(input: str, 
                user_answer: Optional[str] = None,
                stage: int = 1, 
                step: int = 0, 
                user_id: Optional[str] = None, 
                conversation_id: Optional[str] = None) -> tuple:
    
    # 获取RAG结果
    llm_answer = kb_chat(query=input, kb_name='xiaoxue3') #kb_name='question_bank'
    
    # 判断是否错误
    is_error = selector.math_error_selector(input, user_answer, llm_answer)
    
    # 如果错误，经过主流得到回复
    if is_error:
        step += 1
        response = Basic_flow(input=input, 
                              user_answer=user_answer,
                              stage=stage,
                              step=step, 
                              correct_answer=llm_answer, 
                              user_id=user_id, conversation_id=conversation_id)
    
    # 正确，直接跳转到最后回复    
    else:
        response = final_flow(input=input, stage=stage, user_id=user_id, conversation_id=conversation_id)
        stage = 2
        step = 6
    
    # 结合提问和回复获取主题   
    theme = get_theme(input+response)
    
    # 返回 (回复，阶段，步数，主题)
    return response, stage, step, theme


def k_flow(input: str, 
            stage: int = 2, 
            step: int = 1, 
            user_id: Optional[str] = None, 
            conversation_id: Optional[str] = None) -> tuple:
    
    if stage == 2 and step < 5:
        # 链接数据库
        sync_connection = get_sync_connection(DBinfo)
        
        # 记录模式对话历史的数据库
        table_name = "QA_history"
        
        # 定义用于读取写入历史的函数
        get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name=table_name)
        history = get_session_history(user_id=user_id, conversation_id=conversation_id)
        
        is_error = selector.QA_error_selector(history=history, input=input)
        
        
        if is_error:
            response = Understanding_flow(input=input,
                                        step=step,
                                        stage=stage,
                                        user_id=user_id,
                                        conversation_id=conversation_id)
        
        else:
            step += 1
            response = Basic_flow(input=input, 
                                stage=stage, 
                                step=step, 
                                user_id=user_id, 
                                conversation_id=conversation_id)
    else:
        step = 6
        response = final_flow(input=input, 
                              stage=stage, 
                              step=step, 
                              user_id=user_id, 
                              conversation_id=conversation_id)
        

    return response, stage, step


def confused_flow(input: str, 
                stage: int = 0, 
                step: int = 0, 
                user_id: Optional[str] = None, 
                conversation_id: Optional[str] = None) -> tuple:
    
    # 链接数据库
    sync_connection = get_sync_connection(DBinfo)
    
    # 记录模式对话历史的数据库
    table_name = "QA_history"
    
    # 定义用于读取写入历史的函数
    get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name=table_name)
    
    # 定义模型
    model = Tongyi(
        model_name= 'qwen-turbo',
        temperature=0.5,
        api_key='',
    )    
    
    # 如果是第一轮对话，初始化对话
    #TODO 异常处理
    prompt = ChatPromptTemplate.from_messages(
        [
            MessagesPlaceholder(variable_name="history"),
            ("human", "{context}```{input}```"),
        ]
    )
        
    # 获取引导部分的上下文
    context = Context.confused_context.format(
        example = Sample.confused_sample,
        idx = step
    )
    
    # 模型运行的链
    runnable = prompt | model
    
    # 定义运行函数
    run_with_history = runnable_with_history(
        runnable,
        get_session_history,
        input_key='input'   
    )
    
    # 对话
    response = run_with_history.invoke(
        {'context': context, 'input': input},
        config={"configurable": {"user_id": str(user_id), "conversation_id": str(conversation_id)}},
    )
    
    return response, stage, step



def Understanding_flow(input: str, 
                       step: int, 
                       stage:int, 
                       user_id: str, 
                       conversation_id: str) -> str:

    # 链接数据库
    sync_connection = get_sync_connection(DBinfo)
    
    # 记录模式对话历史的数据库
    table_name = "QA_history"
    
    # 定义用于读取写入历史的函数
    get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name=table_name)
    
    # 定义模型
    model = Tongyi(
        model_name= 'qwen-turbo',
        temperature=0.5,
        api_key='',
    )    
    
    # 如果是第一轮对话，初始化对话
    #TODO 异常处理
    prompt = ChatPromptTemplate.from_messages(
        [
            MessagesPlaceholder(variable_name="history"),
            ("human", "{context}"),
        ]
    )
    
    # 获取引导部分的上下文
    context = Context.understanding_context.format(
        input = input,
        idx = step
    )
    
    # 模型运行的链
    runnable = prompt | model
    
    # 定义运行函数
    run_with_history = runnable_with_history(
        runnable,
        get_session_history,
        input_key='context'   
    )
    
    # 对话
    response = run_with_history.invoke(
        {'context': context },
        config={"configurable": {"user_id": str(user_id), "conversation_id": str(conversation_id)}},
    )
        
    return response


def final_flow(input: str, 
            stage: int = 2, 
            step: int = 6, 
            user_id: Optional[str] = None, 
            conversation_id: Optional[str] = None) -> str:
    
    # 如果答案正确
    if stage == 1: 
        sync_connection = get_sync_connection(DBinfo)
    
        table_name = "QA_history"
        
        get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name=table_name)
        
        model = Tongyi(
            model_name= 'qwen-turbo',
            temperature=0.5,
            api_key='',
        )    
        
        
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "你是一位和蔼可亲，善于引导学生解题的小学数学老师",
                ),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}{input}"),
            ]
        )
        
        runnable = prompt | model
        
        run_with_history = runnable_with_history(
            runnable,
            get_session_history,   
        )
        
        
        final_context = "你的学生正确回答了问题，请你表扬学生的表现\n"
        
        
        response = run_with_history.invoke(
            {'context': final_context, 'input': input},
            config={"configurable": {"user_id": str(user_id), "conversation_id": str(conversation_id)}},
        )

    # 如果是引导式问答结束之后，没有开始新问题    
    else:
        
        sync_connection = get_sync_connection(DBinfo)
    
        table_name = "QA_history"
        
        get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name=table_name)
        
        model = Tongyi(
            model_name= 'qwen-turbo',
            temperature=0.5,
            api_key='',
        )    
        
        
        prompt = ChatPromptTemplate.from_messages(
            [
                ('system', "请你结合历史和学生进行交流"),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ]
        )
        
        runnable = prompt | model
        
        run_with_history = runnable_with_history(
            runnable,
            get_session_history, 
            input_key="input"  
        )
        
        
        response = run_with_history.invoke(
            {'input': input},
            config={"configurable": {"user_id": str(user_id), "conversation_id": str(conversation_id)}},
        )
    
    return response












# 怎么指定阶段和对话，每次都返回两个id，stage，step，对话输出
# userid，conversationid为空，初始化
# 如果问题，答案形式，则代表new，不需要经过筛选器，返回 stage 1  step 1
    # 如果new，rag得答案，大模型比对(一个prompt)
# 如果普通输入，代表正常流，进入筛选器，判断困惑
    # 如果不困惑，输入给大模型(一个prompt)判断正确与否，stage 2 由 step k 控制步骤
        # 如果错误，传入问题和回答，prompt进行初始化，然后生成新的uuid进入临时会话  stage 3 step 0++
    # 如果普通输入是困惑的，生成新的uuid进入临时会话  stage 0  step 0++
# 如果stage 2 step 5 被传入，返回结束语，stage 改为 1 step 0
# 将user_id, conversation_id, stage拼成uuid
# 不存模板和样例

# stage  step      means
#   1     0       wait for first input
#   1     1       new 
#   2     k<6     normal   k保持不变用于指明理解的部分
#   2     k>=6    最后的对话

# 问题答案形式
# 问题：
# 答案：


def QA_flow(input: str, 
            user_answer: Optional[str] = None,
            stage: int = 1, 
            step: int = 0, 
            user_id: Optional[str] = None, 
            conversation_id: Optional[str] = None) -> tuple:    
    
    # if user_id == None: user_id = uuid.uuid4()
    # if conversation_id == None: conversation_id = uuid.uuid4()
    
    if stage == 1 and step == 0:  # 前端传给我
        response, stage, step, theme = first_flow(input=input, 
                                                  user_answer=user_answer, 
                                                  stage=stage, 
                                                  step=step, 
                                                  user_id=user_id, 
                                                  conversation_id=conversation_id)
        insert_theme(user_id, conversation_id, theme, 2)
    elif selector.confused_selector(input):  
        response, stage, step = confused_flow(input=input, 
                                              stage=stage, 
                                              step=step, 
                                              user_id=user_id, 
                                              conversation_id=conversation_id)  # stage 和 step 的修改
    
    
    elif stage == 2 and step < 5:
        response, stage, step = k_flow(input=input, 
                                       stage=stage, 
                                       step=step, 
                                       user_id=user_id, 
                                       conversation_id=conversation_id)

    else:
        stage = 2
        step = 6
        response = final_flow(input=input, 
                            stage=stage, 
                            step=step, 
                            user_id=user_id, 
                            conversation_id=conversation_id) 


    if stage == 1 and step == 1:
        stage += 1
        return response, stage, step
    
    return cv.convert_to_markdown(response), stage, step






if __name__ == '__main__':
    
    
    
    user_id = uuid.uuid4()
    conversation_id = uuid.uuid4()
    user_id = str(user_id)[:18]
    conversation_id = str(conversation_id)[18:]
    query = '下面是第七次全国人口普查中部分省份的人口数，请你将人口数按从多到少的顺序排列。 广东省：126012510人　　河南省：99365519人 山东省：101527453人　　四川省：83674866人'
    user_answer = '101527453＞126012510＞99365519＞83674866'   # 问题和答案的形式
    
    stage = 1
    step = 0
    
    for i in range(8):
        if i == 0:
            response, stage, step, theme = QA_flow(input=query,
                                                                       user_answer=user_answer,
                                                                       stage=stage, step=step, 
                                                                       user_id=user_id, 
                                                                       conversation_id=conversation_id)

        else:            
            query = input('Student:')
            response, stage, step = QA_flow(input=query,
                                                                       user_answer=user_answer,
                                                                       stage=stage, step=step, 
                                                                       user_id=user_id, 
                                                                       conversation_id=conversation_id)
            
        print('-'*20)
        if i == 0: print(f'theme:{theme}')
        print(f'res:{response}')
        print(f'stage:{stage}')
        print(f'step:{step}')
        print(f'user_id:{user_id}')
        print(f'conversation_id:{conversation_id}')
        print('-'*20)

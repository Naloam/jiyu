from langchain_community.llms.tongyi import Tongyi
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder

def confused_selector(query: str):
    model = Tongyi(
        model_name= 'qwen-turbo',
        api_key='',
        temprature = 0.0
    ) 
    prompt = f"""【角色】你是一个句子疑惑与否的判断器，只需要输出0或1。
    如果【查询】表达了疑惑，请输出1，如果【查询】没有表达疑惑，请输出0，不允许其它形式的输出。
    【查询】{query}
    """
    
    is_confused = True if model.invoke(prompt) == '1' else False
    
    return is_confused



def math_error_selector(query: str, user_answer: str, correct_answer: str):
    model = Tongyi(
        model_name= 'qwen-turbo',
        api_key='',
        temprature = 0.0
    )
    prompt = f"""【角色】你是一个判断【问题】的答案是否正确的判断器，只需要输出0或1。
    请忽略【答案】和【正确答案】因为格式和书写方式不同导致的不一致
    如果【答案】和【正确答案】表达的意思不相符，请输出1，如果【答案】和【正确答案】表达的意思相符，请输出0，不允许其它形式的输出。
    【问题】{query}
    【答案】{user_answer}
    【正确答案】{correct_answer}
    """
    
    is_error = True if model.invoke(prompt) == '1' else False
    
    return is_error


def QA_error_selector(history, input: str):
    
    model = Tongyi(
        model_name= 'qwen-turbo',
        api_key='',
        temprature = 0.0
    )    

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "你是一个问题答案是否合理的判断器\n"
                "请你根据提供的老师和学生的历史对话内容判断【当前学生回答】是否正确回答了老师的问题\n"
                "只允许输出0和1，当不正确时输出1，当正确时输出0",
            ),
            MessagesPlaceholder(variable_name="history"),
            ("human", f"【学生回答】：{input}")
        ]
    )
    
    runnable = prompt | model
    
    response = runnable.invoke({"history": history.messages})  
    
    is_error = True if response == '1' else False
    
    return is_error

if __name__ == '__main__':
    # query1 = '什么叫费曼学习法'
    # query2 = '一元二次方程'
    # query3 = '我具体该怎么做'
    # query4 = '这是什么意思'

    # print(confused_selector(query1))
    # print(confused_selector(query2))
    # print(confused_selector(query3))
    # print(confused_selector(query4))
    
    query = '下面是第七次全国人口普查中部分省份的人口数，请你将人口数按从多到少的顺序排列。 广东省：126012510人　　河南省：99365519人 山东省：101527453人　　四川省：83674866人'
    query2 = '幸福小学举行小小朗读者比赛，华华准备了一篇1200个字的演讲稿，规定每名同学的演讲时间不超过5分钟。如果她每分钟读235个字，在规定时间内能读完吗？'
    
    answer1 = '126012510  101527453  99365519  83674866'
    answer2 = '126012510＞101527453＞99365519＞83674866'
    
    answer3 = '126012510＞101527453＞99365519＞83674866'
    answer4 = '101527453＞126012510＞99365519＞83674866'
    
    answer5 = '126012510＞101527453＞99365519＞83674866'
    answer6 = '126012510＞101527453＞99365519＞83674866'
    
    answer7 = '华华在规定时间内不能读完'
    answer8 = '在规定时间内不能读完'
    
    # print(error_selector(query, user_answer=answer1, correct_answer=answer2))
    # print(error_selector(query, user_answer=answer3, correct_answer=answer4))
    # print(error_selector(query, user_answer=answer5, correct_answer=answer6))
    print(math_error_selector(query2, user_answer=answer7, correct_answer=answer8))



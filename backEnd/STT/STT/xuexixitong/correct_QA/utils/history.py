import uuid
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from langchain_postgres import PostgresChatMessageHistory
import psycopg
from langchain_core.messages import HumanMessage
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import ConfigurableFieldSpec
from langchain_community.llms.tongyi import Tongyi

#"dbname=test_history user=CWC password=123456789 port=15432"

# 连接postgres数据库  （提前建好数据库）
def get_sync_connection(connection_info: str):
    sync_connection = psycopg.connect(connection_info)
    return sync_connection


# 定义读取写入数据库函数，传入用户id，会话id，缝合成新uuid，到时应该是前端传入
def get_session_history_with_connection_info(sync_connection, table_name: str):
    
    def get_session_history(user_id: str, conversation_id: str):
        return PostgresChatMessageHistory(table_name, f"{user_id}{conversation_id}", sync_connection=sync_connection)
    
    return get_session_history


# 初始化历史对话实例
def runnable_with_history(runnable, 
                          get_session_history: callable, 
                          input_key: str = "input"):
    
    with_message_history = RunnableWithMessageHistory(
        runnable,
        get_session_history,
        input_messages_key=input_key,  # 声明需要保存的键
        history_messages_key="history", # 历史记录对应的键
        history_factory_config=[
            ConfigurableFieldSpec(
                id="user_id",
                annotation=str,
                name="User ID",
                description="Unique identifier for the user.",
                default="",
                is_shared=True,
            ),
            ConfigurableFieldSpec(
                id="conversation_id",
                annotation=str,
                name="Conversation ID",
                description="Unique identifier for the conversation.",
                default="",
                is_shared=True,
            ),
        ],
    )

    return with_message_history






if __name__ == '__main__':
    
    sync_connection = get_sync_connection("dbname=test_history user=WKK password=1234 port=5432")
    
    
    # # 建表
    # table_name = "chat_history"
    # PostgresChatMessageHistory.create_tables(sync_connection, table_name)

    # # 生成唯一标识
    # session_id = str(uuid.uuid4())

    # # 测试
    # chat_history = PostgresChatMessageHistory(
    #     table_name,
    #     session_id,
    #     sync_connection=sync_connection
    # )

    # chat_history.add_messages([
    #     SystemMessage(content="Meow"),
    #     AIMessage(content="woof"),
    #     HumanMessage(content="bark"),
    # ])

    # print(chat_history.messages)
    
    model = Tongyi(
        model_name= 'qwen-turbo',
        temperature=0.7,
        api_key='',
    )
    get_session_history = get_session_history_with_connection_info(sync_connection=sync_connection, table_name='test_history')

    with_message_history = runnable_with_history(
        model,
        get_session_history,
    )
    
    session_id1 = uuid.uuid4()
    session_id2 = uuid.uuid4()

    # 给prompt样例传入字典，传入用户id和会话id
    with_message_history.invoke(
        {"language": "italian", "input": "hi im bob!"},
        config={"configurable": {"user_id": str(session_id1)[:18], "conversation_id": str(session_id2)[18:]}},

    )







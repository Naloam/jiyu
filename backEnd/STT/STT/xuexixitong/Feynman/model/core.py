import uuid
from langchain_community.llms.tongyi import Tongyi
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from xuexixitong.Feynman.model import DB_Init as DB
from xuexixitong.Feynman.prompt import context as pc
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import ConfigurableFieldSpec
from langchain_community.llms.tongyi import Tongyi
from langchain_postgres import PostgresChatMessageHistory



from typing import Optional

#全局变量
# table_name = "normal_chat_history"                # 表名称
table_name = "Feynman_history"
sync_connection = DB.Initialize_database(table_name)  #数据库

def get_session_history(user_id: Optional[str] = None,
                conversation_id: Optional[str] = None):
    return PostgresChatMessageHistory(table_name, f"{user_id}{conversation_id}", sync_connection=sync_connection)


def generalchat(user_id: str,
                conversation_id: str,
                prompt,
                context,
                input:str):
    # 记录模式对话历史的数据库
    table_name = 'feiman_history'

    # 定义模型
    model = Tongyi(
        model_name='qwen-turbo',
        temperature=0.7,
        api_key='',
    )


    # 模型运行的链
    runnable = prompt | model

    # 定义运行函数
    with_message_history = RunnableWithMessageHistory(
        runnable,
        get_session_history,
        input_messages_key='input',  # 声明需要保存的键
        history_messages_key="history",  # 历史记录对应的键
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

    # 对话
    if context != None:
        response = with_message_history.invoke(
            {'context': context,'input':input},
            config={"configurable": {"user_id": str(user_id)[:18], "conversation_id": str(conversation_id)}},
        )
    else:
        response = with_message_history.invoke(
            {'input':input},
            config={"configurable": {"user_id": str(user_id)[:18], "conversation_id": str(conversation_id)}},
        )
    
    return response
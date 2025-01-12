from langchain_postgres import PostgresChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import ConfigurableFieldSpec
from langchain_community.llms.tongyi import Tongyi
import xuexixitong.General_QA.prompt as pt
import xuexixitong.General_QA.DB_Init as DB
import xuexixitong.Conversion as cv
from typing import Optional

#全局变量
table_name = "normal_chat_history"                # 表名称，可自定义
prompt = pt.Def_Prompt()                   # prompt
sync_connection = DB.Initialize_database(table_name)  #数据库


def get_session_history(user_id: Optional[str] = None,
                conversation_id: Optional[str] = None):
    '''
    langchain需要返回历史信息
    返回值为该对话所有历史信息的string
    '''
    return PostgresChatMessageHistory(table_name, f"{user_id}{conversation_id}", sync_connection=sync_connection)

#LLM生成
def generalchat(input:str,
                user_id: Optional[str] = None,
                conversation_id: Optional[str] = None ) -> str:
    '''
    用户输入：input
    用户ID：user_id
    会话ID：conversation_id
    return LLM_output
    '''
    model = Tongyi(  # 定义模型
        model_name='qwen-turbo',
        temperature=0.7,
        api_key='',
    )
    # 简单的链
    runnable = prompt | model

    # 初始化历史对话实例
    with_message_history = RunnableWithMessageHistory(
        runnable,
        get_session_history,
        input_messages_key="input",  # 声明需要保存的键
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

    result = with_message_history.invoke(
        {"language": "chinese", "input":str(input)},
        config={"configurable": {"user_id": str(user_id)[:18], "conversation_id": str(conversation_id)}},
    )
    return cv.convert_to_markdown(result)

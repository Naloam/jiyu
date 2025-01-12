import uuid
from langchain_core.messages import SystemMessage, AIMessage, HumanMessage
from langchain_postgres import PostgresChatMessageHistory
import psycopg

def Initialize_database(table_name:str):
    '''
    数据库初始化与建表
    table_name：普通模式建表的名称
    return 数据库连接
    '''
    #连接数据库，把数据库名称dbname，user，password，port修改一下
    sync_connection = psycopg.connect(r"dbname=postgres user=postgres password=root port=15432")
    PostgresChatMessageHistory.create_tables(sync_connection, table_name)
    return sync_connection

if __name__ == '__main__':
    Initialize_database("QA_history")

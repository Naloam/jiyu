import uuid
import psycopg2
from xuexixitong.General_QA import DB_Init as DB
def CreateuserID():
    '''生成user_id'''
    user_id =str(uuid.uuid4())[:18]
    #查重
    if ID_check(0,user_id):
        user_id = CreateuserID()
    print(user_id)
    return user_id

def CreateConversation(paradigm:int =0):
    '''根据三种不同模式生成conversation_id'''
    if paradigm == 0:
        print("Wrong")
    else:
        #生成conversation_id
        conversation_id = '-' + str(paradigm) # 每个模式的paradigm都不一样
        conversation_id += str(uuid.uuid4())[20:]
        # 查重
        if ID_check(0,conversation_id,paradigm):
            conversation_id = CreateConversation(paradigm)
        print(conversation_id)
        return conversation_id


def ID_check(type: int = -1,
             ID: str = None,
             paradigm: int = 0):
    '''
        检查id是否存在
        type:0代表user_id,1代表conversation_id
        ID：user_id或者conversation_id
        paradigm：三种对话模式1，2，3
    '''
    if ID is None or type == -1:
        print("Error\n")
    else:
        table_name = ''
        if paradigm == 0:
            #table_name = 'userID_table'
            print(1)
        if paradigm == 1:
            table_name = "normal_chat_history"
        elif paradigm == 2:
            table_name = "normal_chat_history"
        elif paradigm == 3:
            table_name = "normal_chat_history"

        # 建立数据库连接
        #dbname=test_history user=WKK password=1234 port=5432
        con = psycopg2.connect(database="postgres", user="postgres", password="root", host="localhost", port="15432")
        # 调用游标对象
        cur = con.cursor()
        #查询
        if type == 0:
            cur.execute(f'''SELECT
                            CASE
                                WHEN EXISTS (
                                    SELECT 1
                                    FROM normal_chat_history
                                    WHERE substring(session_id::text FROM 1 FOR 18)  = '{ID}'
                                ) THEN 1
                                ELSE 0
                            END AS has_matching_session_id;
                        ''')
        else:
            cur.execute(f'''SELECT
                                        CASE
                                            WHEN EXISTS (
                                                SELECT 1
                                                FROM normal_chat_history
                                                WHERE substring(session_id::text FROM 19 FOR 36)  = '{ID}'
                                            ) THEN 1
                                            ELSE 0
                                        END AS has_matching_session_id;
                                    ''')
        row = cur.fetchall()
        if row[0][0] == 1:
            return True
        else:
            return False


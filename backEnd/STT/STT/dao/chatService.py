import psycopg2


def output_theme(user_id:str,
                 paradigm:int):
    table_name =  'theme'
    # 建立数据库连接
    # dbname=test_history user=WKK password=1234 port=5432
    con = psycopg2.connect(database="postgres", user="postgres", password="root", host="localhost", port="15432")
    # 调用游标对象
    cur = con.cursor()
    # 查询
    cur.execute(f'''SELECT theme,conversation_id
                    FROM {table_name}
                    WHERE user_id = '{user_id}' AND model = {paradigm}
                ''')
    rows = cur.fetchall() # 格式：[(theme,conversation_id),]
    return rows

def get_history(user_id,conversation_id,table_name):
    con = psycopg2.connect(database="postgres", user="postgres", password="root", host="localhost", port="15432")
    cur = con.cursor()
    # 查询
    cur.execute(f'''SELECT message
                    FROM {table_name}
                    WHERE session_id = '{user_id + conversation_id}'
                ''')
    rows = cur.fetchall()  # 格式：[(theme,conversation_id),]
    history = []
    for row in rows:
        history.append(row[0]['data']['content'])
    return history

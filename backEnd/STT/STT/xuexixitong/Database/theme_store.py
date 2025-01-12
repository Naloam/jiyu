import psycopg2
from xuexixitong.Database.Config import config
from xuexixitong.Database.create_table import create_tables

def insert_theme(user_id:str,
                  conversation_id:str,
                  theme:str,
                  model:int):
    """ insert a new vendor into the vendors table """
    create_tables()
    sql = """INSERT INTO theme(user_id,conversation_id,theme,model)
             VALUES(%s,%s,%s,%s);"""
    conn = None
    try:
        # read Database configuration
        params = config()
        # connect to the PostgreSQL Database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql, (user_id,conversation_id,theme,model))
        # commit the changes to the Database
        conn.commit()
        # close communication with the Database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    print("主题保存完成")

if __name__ == '__main__':
    insert_theme('2','2','圆的面积',1)
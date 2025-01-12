import psycopg2
from xuexixitong.Database.Config import config

def create_tables():
    """ create tables in the PostgreSQL Database"""
    command ="""
        CREATE TABLE IF NOT EXISTS theme (
                user_id VARCHAR(255) NOT NULL,
                conversation_id VARCHAR(255) NOT NULL,
                theme VARCHAR(255) NOT NULL,
                model INTEGER NOT NULL,
                PRIMARY KEY (user_id , conversation_id)
        )
        """
    conn = None
    try:
        # read the connection parameters
        params = config()
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        # create table one by one
        cur.execute(command)
        # print(command)
        # close communication with the PostgreSQL Database server
        cur.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

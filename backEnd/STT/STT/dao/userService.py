import psycopg2

conn = psycopg2.connect(host='localhost', user='postgres', password='root', database='postgres', port=15432)
cursor = conn.cursor()


def insert(userName, password, userId):
    try:
        sql = "INSERT INTO users (name, password, userid) VALUES (%s, %s, %s)"
        cursor.execute(sql, (userName, password, userId))
        conn.commit()
        return True
    except psycopg2.Error as e:
        return False


def findByName(name):
    try:
        print(name)
        sql = "SELECT * FROM users WHERE name = %s"
        params = (name,)
        cursor.execute(sql, params)
        res = cursor.fetchone()
        # print(res)
        if res:
            return res, True
        else:
            return "Not Found", False
    except psycopg2.NotSupportedError as e:
        return f"Error: {e}", False

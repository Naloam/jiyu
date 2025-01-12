import psycopg2

conn = psycopg2.connect(host='localhost', user='postgres', password='root', database='postgres', port=15432)
cursor = conn.cursor()


def insert(userId):
    try:
        sql = "INSERT INTO knowledge (userid, k1, k2, k3, k4, k5, k6) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (userId, "000000", "0000000000000", "00000000000000000",
                             "0000000000000000", "0000000000000", "000000000000"))
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        return False


def findByUserId(userId):
    try:
        sql = "SELECT * FROM knowledge WHERE userid = %s"
        cursor.execute(sql, (userId,))
        res = cursor.fetchone()
        # print(res)
        if res:
            return res, True
        else:
            return "Not Found", False
    except psycopg2.NotSupportedError as e:
        return f"Error: {e}", False


def update(userId, ks):
    try:
        sql = "update knowledge set k1 = %s, k2 = %s, k3 = %s, k4 = %s, k5 = %s, k6 = %s where userid = %s"
        cursor.execute(sql, (ks[0], ks[1], ks[2], ks[3], ks[4], ks[5], userId))
        conn.commit()
        # print(res)
        return True
    except psycopg2.NotSupportedError as e:
        print(e)
        return False

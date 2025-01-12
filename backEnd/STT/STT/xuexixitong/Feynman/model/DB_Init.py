from langchain_postgres import PostgresChatMessageHistory
import psycopg

def Initialize_database(table_name):
    sync_connection = psycopg.connect(r"dbname=postgres user=postgres password=root port=15432")
    PostgresChatMessageHistory.create_tables(sync_connection, table_name)
    return sync_connection

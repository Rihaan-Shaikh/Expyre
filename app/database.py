import sqlite3

DATABASE_NAME="expyre.db"

def get_connection():
    conn=sqlite3.connect(DATABASE_NAME)
    return conn

def create_tables():
    conn=get_connection()
    cursor=conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS temp_emails(
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   email TEXT UNIQUE NOT NULL,
                   created_at TEXT NOT NULL,
                   expires_at TEXT NOT NULL
                   )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS received_emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        to_email TEXT NOT NULL,
        from_email TEXT,
        subject TEXT,
        body TEXT,
        received_at TEXT NOT NULL
    )
    """)


    conn.commit()
    conn.close()

def save_temp_email(email,created_at,expires_at):
    conn=get_connection()
    cursor=conn.cursor()


    cursor.execute("""
    INSERT INTO temp_emails (email, created_at, expires_at)
    VALUES (?, ?, ?)
    """, (email, created_at, expires_at))
    conn.commit()
    conn.close()

def get_temp_email(email):
    conn=get_connection()
    cursor=conn.cursor()

    cursor.execute("""
    SELECT email,created_at,expires_at 
    FROM temp_emails 
    WHERE email=?
    """,(email,))

    result=cursor.fetchone()
    conn.close()

    return result

def get_inbox_for_email(email):
    conn=get_connection()
    cursor=conn.cursor()

    cursor.execute("""
    SELECT from_email,subject,body,received_at
    FROM received_emails
    WHERE to_email =?
    ORDER BY received_at DESC
    """,(email,))

    rows=cursor.fetchall()
    conn.close()

    return rows

def save_received_email(to_email, from_email, subject, body, received_at):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO received_emails (to_email, from_email, subject, body, received_at)
    VALUES (?, ?, ?, ?, ?)
    """, (to_email, from_email, subject, body, received_at))

    conn.commit()
    conn.close()


def delete_expired_data(current_time_iso):
    conn = get_connection()
    cursor = conn.cursor()

    # Find expired emails
    cursor.execute("""
    SELECT email FROM temp_emails
    WHERE expires_at <= ?
    """, (current_time_iso,))

    expired_emails = cursor.fetchall()

    # Delete inbox messages for expired emails
    for (email,) in expired_emails:
        cursor.execute("""
        DELETE FROM received_emails
        WHERE to_email = ?
        """, (email,))

    # Delete expired temp emails
    cursor.execute("""
    DELETE FROM temp_emails
    WHERE expires_at <= ?
    """, (current_time_iso,))

    conn.commit()
    conn.close()


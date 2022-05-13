from flask import Flask
import psycopg2


app = Flask(__name__)
app.config['CONNECTION_STRING'] = 'dbname=plantdb user=plantdb password=plantdb'

@app.route('/something')
def something():
    # Example of executing database query
    # https://www.psycopg.org/docs/usage.html#basic-module-usage
    # https://www.psycopg.org/docs/connection.html#the-connection-class
    conn = psycopg2.connect(app.config['CONNECTION_STRING'])
    with conn:
        with conn.cursor() as cursor:
            cursor.execute('CREATE TABLE Region (abbr VARCHAR(4) PRIMARY KEY, name VARCHAR(28) UNIQUE NOT NULL);')
            cursor.execute('INSERT INTO REGION (abbr, name) VALUES (%s, %s);', ('NITL', 'Northern Italy'))
            cursor.execute('SELECT * FROM Region;')
            print('Abbreviation: %s\nRegion: %s\n' % cursor.fetchone(), end='')
            cursor.execute('DROP TABLE Region;')
    # The transaction is commited after the context exits, here

    # The connection still needs to be closed separately
    conn.close()

    return {
        'message': 'ok'
    }
import atexit
from flask import Flask
import psycopg2

app = Flask(__name__)
conn = psycopg2.connect('dbname=plantdb user=plantdb password=plantdb')
atexit.register(conn.close)

# Example of executing database query
# https://www.psycopg.org/docs/usage.html#basic-module-usage
cursor = conn.cursor()
cursor.execute('CREATE TABLE Region (abbr VARCHAR(4) PRIMARY KEY, name VARCHAR(28) UNIQUE NOT NULL);')
cursor.execute('INSERT INTO REGION (abbr, name) VALUES (%s, %s);', ('NITL', 'Northern Italy'))
cursor.execute('SELECT * FROM Region;')
print('Abbreviation: %s\nRegion: %s\n' % cursor.fetchone(), end='')
cursor.execute('DROP TABLE Region;')
conn.commit() # Persist the changes
cursor.close()

@app.route('/something')
def something():
    return {
        'message': 'ok'
    }
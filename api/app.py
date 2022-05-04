import atexit
from flask import Flask
import psycopg2

app = Flask(__name__)
conn = psycopg2.connect('dbname=plantdb user=postgres')
atexit.register(conn.close)

@app.route('/something')
def something():
    return {
        'message': 'ok'
    }
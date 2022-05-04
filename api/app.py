from flask import Flask

app = Flask(__name__)

@app.route('/something')
def something():
    return {
        'message': 'ok'
    }
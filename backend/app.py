from flask import Flask, render_template, url_for, request, redirect, jsonify

app = Flask(__name__)

@app.route('/api/update', methods=['POST', 'GET'])
def updateGraph():
    return jsonify({'hello!': "world"})
    


if __name__ == "__main__":
    app.run(debug=True)

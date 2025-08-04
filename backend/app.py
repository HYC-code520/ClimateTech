# app.py

from flask import Flask, jsonify

# Create the Flask application instance
app = Flask(__name__)

# A simple test route to make sure everything works
@app.route('/')
def index():
    return "API Server is running!"

# This is the main entry point to run the app
if __name__ == '__main__':
    # The host='0.0.0.0' makes the server accessible on your network
    # The port can be any number, 5001 is common for backends
    app.run(host='0.0.0.0', port=5001, debug=True)

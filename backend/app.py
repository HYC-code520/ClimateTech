# app.py

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create the Flask application instance
app = Flask(__name__)

# --- DATABASE CONFIGURATION ---
# Get the database URL from the environment
DATABASE_URL = os.environ.get('DATABASE_URL')

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # This disables a feature we don't need

# Initialize the database object
db = SQLAlchemy(app)

# --- Import your models AFTER initializing db to avoid circular imports ---
# This line will cause an error for now, because we haven't created models.py yet.
# That is our very next step.
from models import Company, Investor, Founder, FundingRound

# A simple test route to make sure everything works
@app.route('/')
def index():
    return "API Server is running!"

# This is the main entry point to run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all() # This creates the tables based on your models
    app.run(host='0.0.0.0', port=5001, debug=True)

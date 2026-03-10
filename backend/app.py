from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/legalease')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_key')

mongo = PyMongo(app)

# Import routes
from routes.auth import auth_bp
from routes.legal import legal_bp
from routes.documents import documents_bp

app.register_blueprint(auth_bp)
app.register_blueprint(legal_bp)
app.register_blueprint(documents_bp)

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('auth.login'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    return render_template('dashboard.html', username=session.get('username'))

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Page not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, host='localhost', port=5000)

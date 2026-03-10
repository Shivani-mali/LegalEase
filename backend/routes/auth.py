from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, current_app
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
def get_db():
    """Get MongoDB instance from main app to avoid using current_app at import time"""
    from app import mongo
    return mongo

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400
        
        # Connect to MongoDB
        from app import mongo
        user = mongo.db.users.find_one({'email': email})
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = str(user['_id'])
            session['username'] = user['name']
            session['email'] = user['email']
            return jsonify({'success': True, 'message': 'Login successful', 'redirect': '/dashboard'}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        if not all([name, email, password, confirm_password]):
            return jsonify({'success': False, 'message': 'All fields required'}), 400
        
        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400
        
        from app import mongo
        
        # Check if user already exists
        if mongo.db.users.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'Email already registered'}), 409
        
        # Hash password and save user
        hashed_password = generate_password_hash(password)
        user = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': __import__('datetime').datetime.utcnow()
        }
        
        result = mongo.db.users.insert_one(user)
        return jsonify({'success': True, 'message': 'Registration successful', 'redirect': '/auth/login'}), 201

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))

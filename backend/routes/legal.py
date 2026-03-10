from flask import Blueprint, request, jsonify, current_app, session
from flask_pymongo import PyMongo
from datetime import datetime

legal_bp = Blueprint('legal', __name__, url_prefix='/api/legal')

def get_mongo():
    """Get MongoDB instance"""
    from app import mongo
    return mongo

@legal_bp.route('/ask', methods=['POST'])
def ask_question():
    """Handle legal questions"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    question = data.get('question', '').strip()
    language = data.get('language', 'en')
    
    if not question:
        return jsonify({'success': False, 'message': 'Question cannot be empty'}), 400
    
    # Get answer from knowledge base
    mongo = get_mongo()
    answer = search_knowledge_base(question, language, mongo)
    
    # Save query to database
    query_record = {
        'user_id': session['user_id'],
        'question': question,
        'language': language,
        'timestamp': datetime.utcnow()
    }
    mongo.db.queries.insert_one(query_record)
    
    return jsonify({
        'success': True,
        'answer': answer,
        'language': language
    }), 200

@legal_bp.route('/laws', methods=['GET'])
def get_laws():
    """Get all law categories"""
    mongo = get_mongo()
    laws = list(mongo.db.laws.find({}, {'_id': 0}))
    return jsonify({'success': True, 'laws': laws}), 200

@legal_bp.route('/laws/<category>', methods=['GET'])
def get_law_by_category(category):
    """Get laws by category"""
    mongo = get_mongo()
    laws = list(mongo.db.laws.find({'category': category}, {'_id': 0}))
    return jsonify({'success': True, 'laws': laws}), 200

def search_knowledge_base(question, language, mongo):
    """Search knowledge base for answer"""
    import re
    
    # Try Kaggle Dataset Search First (For BNS Laws)
    try:
        from routes.kaggle_legal import search_kaggle_datasets
        kaggle_answers = search_kaggle_datasets(question)
    except Exception as e:
        print("Kaggle dataset error:", e)
        kaggle_answers = []
        
    keywords = [k for k in question.lower().split() if len(k) > 2]
    if not keywords:
        keywords = [question.lower()]
        
    regex_pattern = '|'.join([re.escape(k) for k in keywords])
    
    # Search in laws collection
    results = list(mongo.db.laws.find({
        '$or': [
            {'keywords': {'$in': keywords}},
            {'title': {'$regex': regex_pattern, '$options': 'i'}},
            {'description': {'$regex': regex_pattern, '$options': 'i'}},
            {'category': {'$regex': regex_pattern, '$options': 'i'}}
        ]
    }).limit(3))
    
    answers = []
    
    # Add Kaggle results
    if kaggle_answers:
        for ans in kaggle_answers:
            answers.append(ans)
            
    for result in results:
        if language == 'hi':
            answer_text = f"**{result.get('title_hi', result.get('title'))}**\n\n{result.get('description_hi', result.get('description'))}"
        else:
            answer_text = f"**{result.get('title')}**\n\n{result.get('description')}"
        answers.append(answer_text)
    
    if answers:
        response = "\n\n---\n\n".join(answers)
    else:
        # Provide generic response based on available data
        categories = mongo.db.laws.distinct('category')
        cat_str = ", ".join([str(c).title() for c in categories]) if categories else "Fundamental Rights, Criminal Laws, Corporate Laws"
            
        if language == 'hi':
            response = f"क्षमा करें, आपके सटीक प्रश्न के लिए कोई सीधा उत्तर नहीं मिला। हालाँकि, हमारे उपलब्ध डेटा के अनुसार, आप इन श्रेणियों के बारे में जानकारी प्राप्त कर सकते हैं: {cat_str}। कृपया अधिक विशिष्ट कीवर्ड का उपयोग करें या 'कानून एक्सप्लोर करें' सेक्शन देखें।"
        else:
            response = f"We couldn't find an exact match for your query. However, based on our legal database, we provide information on areas such as: **{cat_str}**. Please try searching with more specific keywords, or browse the 'Explore Laws' section for comprehensive details."
    
    # Add disclaimer
    if language == 'hi':
        disclaimer = "\n\n⚠️ अस्वीकरण: यह सहायक केवल सामान्य कानूनी जानकारी प्रदान करता है। यह किसी योग्य वकील की सलाह का विकल्प नहीं है।"
    else:
        disclaimer = "\n\n⚠️ Disclaimer: This assistant provides general legal information only. It is not a substitute for professional legal advice."
    
    return response + disclaimer

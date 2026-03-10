from flask import current_app
from flask_pymongo import PyMongo

def initialize_database(mongo):
    """Initialize database with sample data"""
    db = mongo.db
    
    # Sample laws data
    laws_data = [
        {
            'title': 'Indian Penal Code (IPC)',
            'title_hi': 'भारतीय दंड संहिता (IPC)',
            'category': 'criminal',
            'description': 'The Indian Penal Code is the main criminal law of India.',
            'description_hi': 'भारतीय दंड संहिता भारत का मुख्य आपराधिक कानून है।',
            'act': 'IPC, 1860',
            'sections': '1-511',
            'keywords': ['crime', 'punishment', 'criminal', 'offense']
        },
        {
            'title': 'Criminal Procedure Code',
            'title_hi': 'आपराधिक प्रक्रिया संहिता',
            'category': 'criminal',
            'description': 'This code regulates the criminal process in India.',
            'description_hi': 'यह संहिता भारत में आपराधिक प्रक्रिया को नियंत्रित करती है।',
            'act': 'CrPC, 1973',
            'sections': '1-484',
            'keywords': ['procedure', 'criminal', 'investigation', 'trial']
        },
        {
            'title': 'Indian Contract Act',
            'title_hi': 'भारतीय संविदा अधिनियम',
            'category': 'civil',
            'description': 'This act defines laws related to contracts in India.',
            'description_hi': 'यह अधिनियम भारत में संविदाओं से संबंधित कानूनों को परिभाषित करता है।',
            'act': 'Contract Act, 1872',
            'sections': '1-238',
            'keywords': ['contract', 'agreement', 'offer', 'acceptance']
        },
        {
            'title': 'Payment of Wages Act',
            'title_hi': 'मजदूरी भुगतान अधिनियम',
            'category': 'labour',
            'description': 'Regulates the payment of wages to workers in India.',
            'description_hi': 'भारत में श्रमिकों को मजदूरी का भुगतान करने को नियंत्रित करता है।',
            'act': 'Payment of Wages Act, 1936',
            'sections': '1-26',
            'keywords': ['wages', 'payment', 'salary', 'worker', 'employee']
        },
        {
            'title': 'Consumer Protection Act',
            'title_hi': 'उपभोक्ता संरक्षण अधिनियम',
            'category': 'consumer',
            'description': 'Protects consumer rights in India.',
            'description_hi': 'भारत में उपभोक्ता अधिकारों की रक्षा करता है।',
            'act': 'Consumer Protection Act, 2019',
            'sections': '1-100',
            'keywords': ['consumer', 'protection', 'rights', 'complaint']
        },
        {
            'title': 'Information Technology Act',
            'title_hi': 'सूचना प्रौद्योगिकी अधिनियम',
            'category': 'cyber',
            'description': 'Regulates cyber crime and digital transactions in India.',
            'description_hi': 'भारत में साइबर अपराध और डिजिटल लेनदेन को नियंत्रित करता है।',
            'act': 'IT Act, 2000',
            'sections': '1-94',
            'keywords': ['cyber', 'digital', 'data', 'internet', 'crime']
        },
        {
            'title': 'Hindu Marriage Act',
            'title_hi': 'हिंदू विवाह अधिनियम',
            'category': 'family',
            'description': 'Governs marriage and divorce of Hindus in India.',
            'description_hi': 'भारत में हिंदुओं के विवाह और तलाक को नियंत्रित करता है।',
            'act': 'Hindu Marriage Act, 1955',
            'sections': '1-33',
            'keywords': ['marriage', 'divorce', 'family', 'custody', 'alimony']
        }
    ]
    
    # Insert laws if not already present
    if db.laws.count_documents({}) == 0:
        db.laws.insert_many(laws_data)

def seed_database(mongo):
    """Seed database with sample data"""
    initialize_database(mongo)

from flask import Blueprint, request, jsonify, session
from flask_pymongo import PyMongo
from datetime import datetime

documents_bp = Blueprint('documents', __name__, url_prefix='/api/documents')

def get_mongo():
    """Get MongoDB instance"""
    from app import mongo
    return mongo

@documents_bp.route('/generate', methods=['POST'])
def generate_document():
    """Generate legal documents"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    doc_type = data.get('document_type')
    content = data.get('content')
    
    if not doc_type or not content:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    # Generate document based on type
    generated_doc = generate_doc_content(doc_type, content)
    
    # Save to database
    mongo = get_mongo()
    doc_record = {
        'user_id': session['user_id'],
        'document_type': doc_type,
        'content': generated_doc,
        'created_at': datetime.utcnow(),
        'status': 'draft'
    }
    result = mongo.db.documents.insert_one(doc_record)
    
    return jsonify({
        'success': True,
        'document_id': str(result.inserted_id),
        'content': generated_doc
    }), 200

@documents_bp.route('/list', methods=['GET'])
def list_documents():
    """List user's documents"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    mongo = get_mongo()
    documents = list(mongo.db.documents.find(
        {'user_id': session['user_id']},
        {'content': 0}
    ).sort('created_at', -1))
    
    # Convert ObjectId to string
    for doc in documents:
        doc['_id'] = str(doc['_id'])
    
    return jsonify({'success': True, 'documents': documents}), 200

def generate_doc_content(doc_type, content):
    """Generate document content based on type"""
    
    if doc_type == 'legal_notice':
        template = f"""
LEGAL NOTICE

Date: {datetime.now().strftime('%d-%m-%Y')}

TO WHOMSOEVER IT MAY CONCERN:

Dear Sir/Madam,

This is to formally notify you that {content.get('defendant', '')} has failed to comply with the terms and conditions of the agreement.

Details of the dispute:
{content.get('details', '')}

The aggrieved party demands:
{content.get('demands', '')}

You are hereby required to comply within 15 (Fifteen) days from the receipt of this notice.

In case of non-compliance, necessary legal action shall be initiated against you without any further notice.

Your prompt action in this matter is required.

Yours faithfully,

{content.get('sender_name', '')}
Address: {content.get('sender_address', '')}
Date: {datetime.now().strftime('%d-%m-%Y')}
"""
    
    elif doc_type == 'fir_draft':
        template = f"""
FIRST INFORMATION REPORT (FIR) - DRAFT

Details of the Complaint:

Complainant Name: {content.get('complainant_name', '')}
Date of Incident: {content.get('incident_date', '')}
Location: {content.get('location', '')}

Description of the Incident:
{content.get('incident_description', '')}

Persons Involved:
{content.get('persons_involved', '')}

Suspected Offense(s):
{content.get('offenses', '')}

Evidence/Witnesses:
{content.get('evidence', '')}

Relief Sought:
{content.get('relief', '')}

DISCLAIMER: This is a draft only. Please approach the Police Station to file an official FIR.

Prepared on: {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}
"""
    
    elif doc_type == 'rent_agreement':
        template = f"""
RENT AGREEMENT

This Rent Agreement made on {datetime.now().strftime('%d-%m-%Y')} between:

LANDLORD:
Name: {content.get('landlord_name', '')}
Address: {content.get('landlord_address', '')}

TENANT:
Name: {content.get('tenant_name', '')}
Address: {content.get('tenant_address', '')}

PROPERTY DETAILS:
Address: {content.get('property_address', '')}
Type: {content.get('property_type', '')}
Area: {content.get('property_area', '')}

RENTAL TERMS:
Monthly Rent: Rs. {content.get('monthly_rent', '')}
Security Deposit: Rs. {content.get('security_deposit', '')}
Duration: {content.get('lease_duration', '')} months
Commencement Date: {content.get('commencement_date', '')}

TERMS AND CONDITIONS:
1. The tenant shall pay rent by the 5th of every month
2. Security deposit shall be refunded upon vacating
3. Property should be maintained in good condition
4. No subletting without prior written consent
5. Utilities to be paid by: {content.get('utility_payer', '')}

Landlord Signature: _________________ Date: _____________
Tenant Signature: ___________________ Date: _____________

Note: This is a template. Consult a lawyer for customization.
"""
    
    elif doc_type == 'affidavit':
        template = f"""
AFFIDAVIT

I, {content.get('deponent_name', '')}, Son/Daughter of {content.get('father_name', '')}, 
residing at {content.get('address', '')}, hereby solemnly affirm and declare as follows:

1. That I am the above-named deponent and competent to make this affidavit.

2. {content.get('statement_1', '')}

3. {content.get('statement_2', '')}

4. {content.get('statement_3', '')}

5. That the facts stated above are true and correct to the best of my knowledge and belief.

Deponent Signature: _____________________
Date: {datetime.now().strftime('%d-%m-%Y')}
Place: {content.get('place', '')}

VERIFICATION:
Verified at {content.get('place', '')} on {datetime.now().strftime('%d-%m-%Y')}

Advocate/Notary: _____________________
Stamp: [To be affixed]

Note: This affidavit must be verified before a Notary/Judicial Officer
"""
    
    else:
        template = "Document template not found"
    
    return template

@documents_bp.route('/<doc_id>', methods=['GET'])
def get_document(doc_id):
    """Get a specific document"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    from bson.objectid import ObjectId
    mongo = get_mongo()
    
    doc = mongo.db.documents.find_one({
        '_id': ObjectId(doc_id),
        'user_id': session['user_id']
    })
    
    if not doc:
        return jsonify({'success': False, 'message': 'Document not found'}), 404
    
    doc['_id'] = str(doc['_id'])
    return jsonify({'success': True, 'document': doc}), 200

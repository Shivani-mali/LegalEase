# LegalEase - AI Law Assistant

## Project Overview
LegalEase is a comprehensive AI-based Legal Assistant System designed to simplify Indian laws for everyone. This application provides instant legal information, document generation, and case tracking services.

## Features

### Core Features
1. **Legal Q&A Assistant** - Ask legal questions in simple language
2. **Law Knowledge Base** - Browse important Indian laws (IPC, CrPC, Consumer Protection Act, etc.)
3. **Document Generator** - Auto-generate legal documents (FIR, Legal Notice, Agreements, Affidavits)
4. **Multilingual Support** - English, Hindi, and Marathi
5. **User Authentication** - Secure login and registration system

### Advanced Features
1. **Case Status Tracker** - Track legal case status (demo version)
2. **Case Similarity Search** - Find similar past cases (mock data)
3. **Lawyer Recommendation** - Get lawyer suggestions based on case type
4. **Document History** - Access previously generated documents

## Tech Stack
- **Backend**: Python 3.8+ with Flask
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with responsive design

## Project Structure
```
LegalEase/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── models/
│   │   └── database.py        # Database initialization
│   ├── routes/
│   │   ├── auth.py           # Authentication routes
│   │   ├── legal.py          # Legal assistant routes
│   │   └── documents.py      # Document generation routes
│   ├── templates/
│   │   ├── login.html        # Login page
│   │   ├── register.html     # Registration page
│   │   └── dashboard.html    # Main dashboard
│   └── static/
│       ├── css/
│       │   ├── style.css     # Global styles
│       │   ├── auth.css      # Auth page styles
│       │   └── dashboard.css # Dashboard styles
│       └── js/
│           ├── auth.js       # Authentication logic
│           └── dashboard.js  # Dashboard functionality
└── README.md                 # Project documentation
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- MongoDB installed and running
- pip (Python package manager)

### Steps

1. **Clone/Navigate to project**
```bash
cd LegalEase
```

2. **Create virtual environment**
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure MongoDB**
- Ensure MongoDB is running on localhost:27017
- Update `.env` file with your MongoDB URI if different

5. **Run the application**
```bash
python backend/app.py
```

6. **Access the application**
- Open browser and go to: `http://localhost:5000`
- Default route redirects to login page

## Usage

### Login/Registration
- Create a new account on the Registration page
- Use credentials to login

### Ask Legal Questions
- Navigate to "Ask Legal Question" section
- Type your question in simple language
- Select language (English/Hindi/Marathi)
- View instant legal information

### Explore Laws
- Browse law categories (Criminal, Civil, Family, Labour, Cyber, Consumer)
- View detailed explanations of laws and sections

### Generate Documents
- Select document type (FIR, Legal Notice, Rent Agreement, Affidavit)
- Fill in the form with required information
- Generate and download documents

### Track Cases
- Enter case number and court name
- View case status and next hearing date

## Database Models

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "String",
  "email": "String",
  "password": "Hashed Password",
  "created_at": "DateTime"
}
```

### Laws Collection
```json
{
  "_id": ObjectId,
  "title": "String",
  "title_hi": "String (Hindi)",
  "category": "String",
  "description": "String",
  "act": "String",
  "sections": "String",
  "keywords": ["Array"]
}
```

### Documents Collection
```json
{
  "_id": ObjectId,
  "user_id": "String",
  "document_type": "String",
  "content": "String",
  "created_at": "DateTime",
  "status": "String"
}
```

### Queries Collection
```json
{
  "_id": ObjectId,
  "user_id": "String",
  "question": "String",
  "language": "String",
  "timestamp": "DateTime"
}
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/logout` - User logout

### Legal Assistant
- `POST /api/legal/ask` - Ask legal question
- `GET /api/legal/laws` - Get all laws
- `GET /api/legal/laws/<category>` - Get laws by category

### Documents
- `POST /api/documents/generate` - Generate document
- `GET /api/documents/list` - List user documents
- `GET /api/documents/<doc_id>` - Get specific document

## UI Theme
- **Colors**: Navy Blue (#1a3a52), Dark Green (#0d4428), White
- **Font**: Poppins, Roboto
- **Icons**: Legal symbols (⚖️ 📜 👨‍⚖️ etc.)
- **Design**: Clean, professional, minimal animations

## Security Considerations
1. Passwords are hashed using werkzeug.security
2. Session management for user authentication
3. Environment variables for sensitive data
4. Input validation on forms

## Important Disclaimers
⚠️ This assistant provides general legal information only and is NOT a substitute for professional legal advice from a qualified lawyer.

## Future Enhancements
1. Real-time case status integration with court databases
2. AI-powered legal document drafting
3. Video consultation with lawyers
4. Advanced search with NLP
5. Mobile app (iOS/Android)
6. Payment integration for premium features

## Support
For issues or feature requests, please contact the development team.

## License
This project is for educational purposes.

---
**Version**: 1.0.0  
**Last Updated**: February 2026

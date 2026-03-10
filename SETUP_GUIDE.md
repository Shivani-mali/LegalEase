## LEGALEASE - QUICK START GUIDE

### 📋 Prerequisites
- Python 3.8+
- MongoDB (running locally or cloud)
- pip (Python package manager)
- Git (optional)

---

## 🚀 Installation Steps

### Step 1: Navigate to Project
```bash
cd "c:\Users\SHIVANI\OneDrive\Desktop\law assistant\LegalEase"
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# For Mac/Linux
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure MongoDB
1. Make sure MongoDB is running on your system
2. Check `.env` file - MongoDB URI should be:
   ```
   MONGO_URI=mongodb://localhost:27017/legalease
   ```
3. If using MongoDB Atlas (Cloud), update URI accordingly

### Step 5: Initialize Database (Optional)
```bash
python backend/init_db.py
```
This will add sample legal data to MongoDB.

### Step 6: Run the Application
```bash
python backend/app.py
```

Expected output:
```
 * Running on http://localhost:5000
 * Debug mode: on
```

### Step 7: Access the Application
- Open your browser
- Go to: `http://localhost:5000`
- You'll be redirected to the login page

---

## 📝 Test Credentials

### Create New Account
1. Click "Create New Account" on login page
2. Fill in details:
   - Name: Your Full Name
   - Email: your.email@example.com
   - Password: Test@123

### Login
- Use the email and password you just created

---

## 🎯 Main Features to Try

### 1. Ask Legal Question
- Go to "Ask Legal Question"
- Type: "What are my rights if my salary is not paid?"
- Select language (English/Hindi/Marathi)
- Click "Get Answer"

### 2. Explore Laws
- Click on any law category card
- View laws and explanations

### 3. Generate Documents
- Go to "Generate Documents"
- Select document type:
  - Legal Notice
  - FIR Draft
  - Rent Agreement
  - Affidavit
- Fill the form
- Generate and download

### 4. Track Cases
- Go to "Case Tracker"
- Enter case number and court name
- View case status

---

## 🛠️ Project Structure

```
LegalEase/
├── backend/
│   ├── app.py                    # Main Flask app
│   ├── init_db.py               # Database initialization
│   ├── requirements.txt          # Dependencies
│   ├── .env                      # Configuration
│   ├── models/
│   │   └── database.py           # Database setup
│   ├── routes/
│   │   ├── auth.py              # Login/Register
│   │   ├── legal.py             # Q&A & Laws
│   │   └── documents.py         # Document generation
│   ├── templates/
│   │   ├── login.html           # Login page
│   │   ├── register.html        # Register page
│   │   └── dashboard.html       # Main interface
│   └── static/
│       ├── css/
│       │   ├── style.css
│       │   ├── auth.css
│       │   └── dashboard.css
│       └── js/
│           ├── auth.js
│           └── dashboard.js
└── README.md                     # Full documentation
```

---

## 🔧 Environment Setup (.env)
```
MONGO_URI=mongodb://localhost:27017/legalease
SECRET_KEY=your_secret_key_here
DEBUG=True
FLASK_ENV=development
```

---

## 📱 UI Color Scheme
- Primary: #1a3a52 (Navy Blue)
- Secondary: #2d5a7b (Dark Blue)
- Accent: #3d7ca5 (Lighter Blue)
- Dark Green: #0d4428
- Background: #f8f9fa (Light)

---

## 🌐 Multi-Language Support
- English (Default)
- Hindi (हिंदी)
- Marathi (मराठी)

All answers and explanations are available in these languages!

---

## 📚 Sample Legal Topics Covered
- IPC (Indian Penal Code)
- Criminal Procedure Code
- Consumer Protection Act
- Labour Laws (Payment of Wages)
- IT Act (Cyber Law)
- Family Laws
- Civil Laws

---

## ⚠️ Important Disclaimers
- This is NOT a substitute for professional legal advice
- Always consult a qualified lawyer for legal matters
- This project is for educational purposes

---

## 🐛 Troubleshooting

### Error: "Connection refused" for MongoDB
- Solution: Start MongoDB service on your system
- Windows: `mongod` in command prompt
- Mac: `brew services start mongodb-community`

### Error: "ModuleNotFoundError"
- Solution: Install requirements again
```bash
pip install -r requirements.txt
```

### Port 5000 already in use
- Solution: Change port in app.py
```python
app.run(debug=True, host='localhost', port=5001)
```

---

## 📞 Support
For issues or questions, refer to README.md or check the code comments.

---

**Happy Legal Assisting! ⚖️📜**

Version: 1.0.0
Last Updated: February 2026

## MongoDB Setup Guide for LegalEase

### Option 1: Local MongoDB Installation (Recommended for Learning)

#### Windows
1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows
   - Download .msi file

2. **Install MongoDB**
   - Run the .msi installer
   - Choose "Install MongoD as a Service"
   - Default path: C:\Program Files\MongoDB\Server\

3. **Start MongoDB Service**
   ```bash
   # Open Command Prompt and run:
   mongod
   
   # You should see:
   # "waiting for connections on port 27017"
   ```

4. **Verify Installation**
   ```bash
   # Open another Command Prompt and run:
   mongosh
   
   # You should see MongoDB shell prompt
   ```

5. **Update .env file**
   ```
   MONGO_URI=mongodb://localhost:27017/legalease
   ```

---

#### Mac
1. **Install using Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

3. **Verify**
   ```bash
   mongosh
   ```

---

#### Linux (Ubuntu)
1. **Import MongoDB GPG Key**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
   ```

3. **Install**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start Service**
   ```bash
   sudo systemctl start mongod
   ```

---

### Option 2: MongoDB Cloud (MongoDB Atlas) - Recommended for Production

1. **Create Free Account**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create cluster (Free Tier)

2. **Get Connection String**
   - In MongoDB Atlas dashboard
   - Click "CONNECT"
   - Choose "Connect your application"
   - Copy connection string

3. **Update .env file**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/legalease?retryWrites=true&w=majority
   ```
   Replace:
   - `username` with your username
   - `password` with your password
   - `cluster` with your cluster name

4. **Add IP to Whitelist**
   - In MongoDB Atlas: Security > Network Access
   - Add your IP address
   - Or add "0.0.0.0/0" for all IPs (development only)

---

## MongoDB Collections Setup

### Automatic Setup
Run the initialization script:
```bash
python backend/init_db.py
```

This will create:
- Collections
- Sample data
- Indexes

### Manual Setup (If needed)

Connect to MongoDB:
```bash
mongosh
```

Create database:
```javascript
use legalease
```

Create collections:
```javascript
db.createCollection("users")
db.createCollection("laws")
db.createCollection("documents")
db.createCollection("queries")
```

Insert sample laws:
```javascript
db.laws.insertMany([
  {
    title: "Indian Penal Code",
    category: "criminal",
    description: "The main criminal law of India",
    act: "IPC, 1860",
    sections: "1-511",
    keywords: ["crime", "punishment"]
  }
])
```

---

## Verify MongoDB Connection

### Test Connection from Python
```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client.legalease

# If no error, connection is successful
print("Connected to MongoDB!")

# View databases
print(client.list_database_names())

# View collections
print(db.list_collection_names())
```

---

## Troubleshooting

### Error: "Connection refused"
**Solution:**
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: "Authentication failed"
**Solution:**
- Check username and password in URI
- Verify IP whitelist (for MongoDB Atlas)

### Error: "Database not found"
**Solution:**
- Database is created automatically
- Run init_db.py to populate with data

### MongoDB Not Running
**Solution:**
```bash
# Check if running
ps aux | grep mongod

# Start again
mongod --config /path/to/config.conf
```

---

## Database Backup & Restore

### Backup Database
```bash
mongodump --uri mongodb://localhost:27017/legalease --out ./backup
```

### Restore Database
```bash
mongorestore --uri mongodb://localhost:27017/legalease ./backup/legalease
```

---

## MongoDB GUI Tools (Optional)

### MongoDB Compass (Recommended)
1. Download: https://www.mongodb.com/products/tools/compass
2. Connect to localhost:27017
3. Visual interface to manage data

### Usage:
- Create/view/edit documents
- Run queries
- Monitor performance

---

## Basic MongoDB Queries

### View all users
```javascript
db.users.find()
```

### View all laws
```javascript
db.laws.find()
```

### Search for specific law
```javascript
db.laws.findOne({ title: "Indian Penal Code" })
```

### Count documents
```javascript
db.users.countDocuments()
```

### Delete a user
```javascript
db.users.deleteOne({ email: "test@example.com" })
```

---

## Environment Variables Setup

### Create .env file
Location: `LegalEase/.env`

```
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/legalease

# Flask Configuration
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
FLASK_ENV=development

# Optional
APP_PORT=5000
APP_HOST=localhost
```

**Important**: Never commit .env file to git (it's in .gitignore)

---

## Database Indexing (For Performance)

Create indexes for faster queries:
```javascript
// Create index on email for faster login
db.users.createIndex({ email: 1 })

// Create index on keywords for faster law search
db.laws.createIndex({ keywords: 1 })

// Create index on user_id for faster document retrieval
db.documents.createIndex({ user_id: 1 })
```

---

## Monitoring Database

### Check database size
```bash
mongosh
use legalease
db.stats()
```

### Check collection sizes
```javascript
db.users.stats()
db.laws.stats()
db.documents.stats()
```

---

## Best Practices

1. **Regular Backups**
   - Schedule weekly backups
   - Store in secure location

2. **Security**
   - Use strong passwords
   - Enable authentication
   - Restrict IP access

3. **Indexing**
   - Create indexes on frequently searched fields
   - Monitor query performance

4. **Data Validation**
   - Implement schema validation
   - Validate user inputs

5. **Connection Pooling**
   - Use connection pools for better performance
   - Reuse connections

---

## Quick Commands Reference

```bash
# Start MongoDB (Windows)
mongod

# Connect to database
mongosh

# Backup database
mongodump --uri mongodb://localhost:27017/legalease --out ./backup

# Restore database
mongorestore --uri mongodb://localhost:27017/legalease ./backup/legalease

# Check MongoDB version
mongod --version
```

---

## Sample .env File
```
MONGO_URI=mongodb://localhost:27017/legalease
SECRET_KEY=your_secret_key_2026
DEBUG=True
FLASK_ENV=development
```

---

**MongoDB Setup Complete!** ✓

Your database is ready to use with LegalEase application.

For more help: https://docs.mongodb.com/

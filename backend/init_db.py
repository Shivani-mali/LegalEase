# Initialize database with sample laws
from app import app, mongo
from models.database import initialize_database

if __name__ == '__main__':
    with app.app_context():
        print("Initializing database...")
        initialize_database(mongo)
        print("Database initialized successfully!")

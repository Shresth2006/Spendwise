import firebase_admin
from firebase_admin import credentials, firestore

# Initialize only once
if not firebase_admin._apps:
    # Ensure this file is in your 'backend' folder
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_firestore_db():
    return db
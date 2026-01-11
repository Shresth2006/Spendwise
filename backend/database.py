import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Ensure serviceAccountKey.json is in the same directory as this file
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_firestore_db():
    """Returns the Firestore client instance."""
    return db

def update_user_budget_settings(user_id: str, monthly_limit: int, category_budgets: dict):
    """
    Saves or updates user-specific budget limits in Firestore.
    Uses merge=True to prevent overwriting other user data (like name or email).
    """
    try:
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'budget_settings': {
                'monthly_limit': monthly_limit,
                'category_budgets': category_budgets,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
        }, merge=True)
        return {"status": "success", "message": "Budget settings updated successfully"}
    except Exception as e:
        print(f"Error updating budget settings: {e}")
        return {"status": "error", "message": str(e)}

def get_user_budget_settings(user_id: str):
    """
    Retrieves the saved budget configuration for a specific user.
    Used by the HomeDashboard to render progress bars.
    """
    try:
        user_doc = db.collection('users').document(user_id).get()
        if user_doc.exists:
            data = user_doc.to_dict()
            # Return only the budget_settings sub-object
            return data.get('budget_settings', {
                "monthly_limit": 0,
                "category_budgets": {}
            })
        return {"monthly_limit": 0, "category_budgets": {}}
    except Exception as e:
        print(f"Error fetching budget settings: {e}")
        return {"monthly_limit": 0, "category_budgets": {}}
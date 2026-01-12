import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from typing import Dict, List
import os


class FirestoreService:
    def __init__(self):
        if not firebase_admin._apps:
            cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_FILE")

            if not cred_path:
                raise RuntimeError(
                    "FIREBASE_SERVICE_ACCOUNT_FILE environment variable not set"
                )

            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)

        self.db = firestore.client()
        self.collection = self.db.collection("reviews")

    def create_review(self, data: Dict) -> str:
        data["created_at"] = datetime.utcnow()
        self.collection.document(data["id"]).set(data)
        return data["id"]

    def update_review(self, review_id: str, data: Dict) -> None:
        self.collection.document(review_id).update(data)

    def get_reviews(self, limit: int = 5000) -> List[Dict]:
        docs = (
            self.collection
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .limit(limit)
            .stream()
        )

        results = []
        for doc in docs:
            d = doc.to_dict()
            d["created_at"] = d["created_at"].isoformat()
            results.append(d)

        return results

from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid

from app.services.firestore_service import FirestoreService
from app.services.llm_service import LLMService

app = FastAPI(title="AI Feedback Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

firestore_service = FirestoreService()
llm_service = LLMService()


# ---------- Schemas ----------

class ReviewSubmission(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    city: Optional[str]
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = Field(None, max_length=800)


class ReviewResponse(BaseModel):
    success: bool
    id: str
    ai_response: str
    saved_at: str


class Review(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    city: Optional[str]
    rating: int
    review: Optional[str]
    ai_user_response: str
    ai_summary: str
    ai_action: str
    status: str
    created_at: str


class ReviewsListResponse(BaseModel):
    success: bool
    reviews: List[Review]
    meta: dict


# ---------- Routes ----------

@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/api/review", response_model=ReviewResponse)
async def submit_review(data: ReviewSubmission):
    review_id = str(uuid.uuid4())

    firestore_service.create_review({
        "id": review_id,
        "name": data.name,
        "email": data.email,
        "city": data.city,
        "rating": data.rating,
        "review": data.review,
        "status": "pending_ai"
    })

    try:
        ai = await llm_service.generate_responses(
            name=data.name,
            rating=data.rating,
            review=data.review,
            city=data.city
        )

        firestore_service.update_review(review_id, {
            "ai_user_response": ai["user_response"],
            "ai_summary": ai["summary"],
            "ai_action": ai["action"],
            "status": "complete"
        })

        return ReviewResponse(
            success=True,
            id=review_id,
            ai_response=ai["user_response"],
            saved_at=datetime.utcnow().isoformat()
        )

    except Exception:
        firestore_service.update_review(review_id, {
            "ai_user_response": "Thanks for your feedback. We'll review it shortly.",
            "ai_summary": "AI processing failed",
            "ai_action": "Manual review needed",
            "status": "ai_failed"
        })
        raise HTTPException(500, "AI processing failed")


@app.get("/api/reviews", response_model=ReviewsListResponse)
def get_reviews():
    reviews = firestore_service.get_reviews()
    return {"success": True, "reviews": reviews, "meta": {"total": len(reviews)}}


@app.post("/api/analytics/insights")
async def get_star_insights(rating: int):
    all_reviews = firestore_service.get_reviews()
    specific_summaries = [
        r.get('ai_summary') 
        for r in all_reviews 
        if r['rating'] == rating and r.get('ai_summary')
    ]
    insights = await llm_service.generate_star_insights(rating,  specific_summaries)
    return {"insights": insights}
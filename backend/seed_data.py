import asyncio
import random
import uuid
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Import your existing services
from app.services.firestore_service import FirestoreService
from app.services.llm_service import LLMService

# --- CONFIGURATION ---
TOTAL_ENTRIES = 22  # Total fake reviews to generate
DAYS_AGO_START = 10 # Start from 30 days ago
EMPTY_REVIEW_CHANCE = 0.10 # 25% chance for rating only (no text)

# --- DATA POOLS ---
INDIAN_CITIES = [
    "Coimbatore",     # Tamil Nadu
    "Mysore",         # Karnataka
    "Visakhapatnam",  # Andhra Pradesh
    "Vijayawada",     # Andhra Pradesh
    "Trivandrum",     # Kerala
    "Kochi",          # Kerala
    "Madurai"         # Tamil Nadu
]


NAMES = [
    "Arjun Reddy", "Sahana Iyer", "Vishal Kumar", "Anika Nair",
    "Karthik Rao", "Meera Menon", "Raghav R", "Divya Krishnan",
    "Hari Prasad", "Sneha Pillai", "Aravindh S", "Lakshmi Raj"
]


# Diverse feedback templates to keep data looking real
FEEDBACK_VARIANTS = {
    5: [
        "Excellent service! Really loved the entire experience from start to finish. The interface is smooth, and the responses are lightning fast. Highly recommend to anyone looking for efficiency.",
        "The best platform I have ever used. Every feature is thoughtfully designed, and it genuinely saves time. I’ve recommended it to my colleagues and friends already.",
        "Super smooth interface with super fast AI responses. 5 stars for the functionality and the user experience. The dashboard is intuitive and visually appealing.",
        "Life saver! This tool has helped my business grow exponentially. The support team is friendly and resolves issues almost instantly. Couldn’t ask for more.",
        "I love how easy it is to navigate through the app. Every feature feels polished, and even new users can get started without any confusion. Great job!"
    ],
    4: [
        "Good experience overall, but there’s room for minor improvements. Sometimes the mobile app lags slightly, but the web interface is flawless. Solid tool.",
        "Very solid platform. Works well for daily tasks and helps keep everything organized. Occasionally, I wish there were more customization options.",
        "Liked the features and AI responses. Mobile app could use some optimization, but otherwise it’s a great tool. Definitely worth the money.",
        "Great support team! Solved my query in minutes. Sometimes response suggestions aren’t perfect, but the AI gets smarter over time.",
        "Overall, value for money. Works well and does what it promises. Small UI quirks here and there, but nothing too distracting."
    ],
    3: [
        "It’s okay. Gets the job done but lacks advanced features that I was hoping for. The AI sometimes gives generic suggestions, so not perfect for complex queries.",
        "Average experience. The UI could be more modern and some workflows feel unintuitive. Works fine for basic tasks, but advanced users might feel limited.",
        "Satisfactory overall, though I faced minor glitches during login and occasionally the AI response was slightly off. Usable, but not exceptional.",
        "The pricing seems a bit high for the features offered. Useful tool, but some competitors offer similar functionality at lower cost.",
        "Middle of the road. Neither bad nor amazing. Works well enough for casual use, but power users might find it lacking in depth."
    ],
    1: [
        "Very poor experience. The app keeps crashing and AI responses are often irrelevant. Waste of time and money. Not recommended at all.",
        "Worst customer service ever. No replies, no solutions. Extremely frustrating when issues arise. Avoid this platform until support improves.",
        "Totally a waste of money. The AI suggestions are inaccurate, the dashboard is slow, and features promised don’t work as expected.",
        "I hate the new update. It broke functionality I used daily. Feels like the developers don’t test anything before release.",
        "Extremely slow and buggy. The app freezes frequently, AI suggestions are off, and basic features don’t work. Completely unusable."
    ]
}

FEEDBACK_VARIANTS[2] = FEEDBACK_VARIANTS[1] # Map 2 stars to 1-star complaints

class DataSeeder:
    def __init__(self):
        self.firestore = FirestoreService()
        self.llm = LLMService()

    def get_random_past_date(self):
        """Generates a random date between 30 days ago and today (Jan 12, 2026)."""
        # Note: Script assumes today is Jan 12, 2026 as per your requirement
        end_date = datetime(2025, 12, 12)
        start_date = end_date - timedelta(days=DAYS_AGO_START)
        
        random_days = random.randint(0, DAYS_AGO_START)
        random_hours = random.randint(0, 23)
        random_minutes = random.randint(0, 59)
        
        return start_date + timedelta(days=random_days, hours=random_hours, minutes=random_minutes)

    async def seed_item(self):
        # 1. Randomize user data
        name = random.choice(NAMES)
        city = random.choice(INDIAN_CITIES)
        rating = random.choices([5, 4, 3, 2, 1], weights=[0, 0, 10, 20, 70])[0]
        email = f"{name.lower().replace(' ', '.')}@south.in"
        
        # 2. Decide if review is empty (25% chance)
        if random.random() < EMPTY_REVIEW_CHANCE:
            review_text = ""
        else:
            review_text = random.choice(FEEDBACK_VARIANTS[rating])
            # Add minor typos or case changes for realism
            if random.random() < 0.3:
                review_text = review_text.lower()

        print(f"Generating: {name} | {rating} Stars | {city}")

        # 3. Call your existing AI service
        try:
            # This uses your existing logic so the AI responses are authentic
            ai = await self.llm.generate_responses(
                name=name,
                rating=rating,
                review=review_text if review_text else "None",
                city=city
            )
        except Exception as e:
            print(f"AI Call failed, using fallback: {e}")
            ai = {
                "user_response": "Thank you for your feedback!",
                "summary": "General feedback received.",
                "action": "Manual review"
            }

        # 4. Save to Firestore with a backdated timestamp
        review_id = str(uuid.uuid4())
        past_date = self.get_random_past_date()
        
        doc_data = {
            "id": review_id,
            "name": name,
            "email": email,
            "city": city,
            "rating": rating,
            "review": review_text,
            "ai_user_response": ai.get("user_response", "Thank you!"),
            "ai_summary": ai.get("summary", "N/A"),
            "ai_action": ai.get("action", "None"),
            "status": "complete",
            "created_at": past_date # This will be stored as a Firebase Timestamp
        }

        # Use the firestore client directly to bypass the 'utcnow' hardcoded in your service
        self.firestore.collection.document(review_id).set(doc_data)

    async def start_seeding(self):
        print(f"🚀 Starting to seed {TOTAL_ENTRIES} historical entries...")
        for i in range(TOTAL_ENTRIES):
            await self.seed_item()
            print(f"✅ Progress: {i+1}/{TOTAL_ENTRIES}")
            # Brief sleep to avoid hitting API rate limits too fast
            await asyncio.sleep(0.5)
        print("✨ Seeding finished!")

if __name__ == "__main__":
    seeder = DataSeeder()
    asyncio.run(seeder.start_seeding())
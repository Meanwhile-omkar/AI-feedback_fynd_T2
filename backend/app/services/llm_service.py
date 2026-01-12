import httpx
import os
import asyncio
import json
import re
from typing import Optional, Dict


class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "xiaomi/mimo-v2-flash:free"
        self.timeout = 10.0
        self.max_retries = 2

    async def generate_responses(
        self,
        name: Optional[str],
        rating: int,
        review: Optional[str],
        city: Optional[str]
    ) -> Dict[str, str]:

        prompt = f"""
                    You are an AI assistant helping a SaaS company analyze customer feedback.

                    INPUT:
                    - Name: {name or "Not provided"}
                    - Rating: {rating}/5
                    - City: {city or "Unknown"}
                    - Review text: {review or "No written feedback"}

                    TASK:
                    Return STRICT JSON with these keys:
                    - user_response (2–4 sentences, empathetic, personalized)
                    - summary (1–2 sentence internal summary)
                    - action (one short recommended action)

                    Tone rules:
                    - Rating 1–2: apologetic, solution-focused
                    - Rating 3: neutral, attentive
                    - Rating 4–5: appreciative, positive

                    Return ONLY valid JSON.
                    """

        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    res = await client.post(
                        self.api_url,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": self.model,
                            "messages": [{"role": "user", "content": prompt}],
                            "max_tokens": 500
                        }
                    )

                    res.raise_for_status()
                    content = res.json()["choices"][0]["message"]["content"]
                    match = re.search(r'\{.*\}', content, re.DOTALL)
                    if match:
                        return json.loads(match.group())
                    raise ValueError("No JSON found")
                    

            except:
                
                await asyncio.sleep(1)

        # Fallback
        return {
            "user_response": "Thanks for your feedback. Our team will review this shortly.",
            "summary": f"Rating {rating}/5. Manual review required.",
            "action": "Review feedback manually"
        }
    

    async def generate_star_insights(self, rating: int, summaries: list[str]) -> list[str]:
        summaries_text = "\n".join([f"- {r}" for r in summaries[:25]]) # Top 25 reviews
        prompt = f"""
                You are an expert SaaS product analyst. 

                Analyze the following {summaries_text}-star reviews and provide exactly 5 **concise, actionable, and high-priority insights** for the product/CS/UX team. 

                Use these rules:
                - if reviews are 5-star reviews: highlight what is working best for customers, basically show what are our strong points which makes us best.
                - if reviews are 4-star reviews: highlight those minor improvements or enhancements that could make the experience excellent.
                - if reviews are 3-star reviews: highlight noticeable areas that need improvement.
                - if reviews are 2-star reviews: highlight problems that require attention.
                - if reviews are 1-star reviews: highlight major issues and fixes that should be done immediately, you can also mention about city.
                - Focus only on the {rating}-star reviews provided.
                - Use clear, actionable language (1 sentence max per insight).
                - Return the output ONLY as a valid JSON array of 5 strings.
                - Do NOT include explanations, numbers, or extra text outside the JSON array.

                Reviews ({len(summaries[:25])} most recent):
                {summaries_text}
        """
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(self.api_url, headers={"Authorization": f"Bearer {self.api_key}"}, json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}]
                })
                content = res.json()["choices"][0]["message"]["content"]
                match = re.search(r'\[.*\]', content, re.DOTALL)
                return json.loads(match.group()) if match else ["No insights found"]
        except: return ["Could not generate insights at this time"]
# AI-Assisted Feedback System 

An **end-to-end, AI-powered feedback platform** designed to transform raw customer sentiment into **structured, actionable product intelligence**.  
The system combines a **frictionless user submission experience** with a powerful **admin analytics & decision-support dashboard**.

---

## 🚀 Overview

This project tackles a core business challenge: **capturing, analyzing, and acting on customer feedback at scale**.

Instead of treating feedback as static text, each submission is processed through an **LLM-powered pipeline** that extracts **intent, sentiment, and priority recommendations in real time**.

The platform is built around **two distinct experiences**:

- **User Dashboard** — Submit feedback and receive immediate, AI-generated responses.
- **Admin Dashboard** — A product intelligence command center to visualize trends, detect issues, and generate AI-driven action plans.

### 🔗 Live Links

- **User Feedback Portal:**   https://ai-feedback-user.vercel.app/

- **Admin Dashboard:**   https://ai-feedback-admin-portal.vercel.app/
---

## 🎯 Problem & Goal

Customer feedback is inherently **unstructured, noisy, and hard to operationalize**.

### The goal of this system was to:

- Convert unstructured feedback into **structured insights**
- Reduce **time-to-action** for product teams
- Remain **reliable under real-world AI and network failures**
---

## 🏗️ System Architecture

The system follows a **functionality-first architecture**, validating the core engine before UI polish.

### High-Level Components

- **Frontend**
  - React-based User & Admin dashboards
  - Styled with Tailwind CSS

- **Backend**
  - FastAPI service acting as an intelligent processing engine
  - Responsible for validation, persistence, and orchestration

- **AI Layer**
  - LLM integration via OpenRouter
  - Structured prompt engineering for deterministic outputs

- **Data Layer**
  - Google Firestore for scalable, persistent storage

> **Key Principle:**  
> Feedback is **always saved**, even if AI calls fail or time out. 
> AI processing is an **enhancement layer**, never a blocking dependency.
> Automatic retries handle transient LLM or network issues.
---
### 👤 User Dashboard

- Minimal, frictionless feedback form with validation
- Interactive star rating with hover animations
- Flip-card reveal showing a **personalized AI-generated response** after submission

---

### 🧠 Admin Dashboard

- **Executive KPI Snapshot**
  - Total Reviews
  - Average Rating
  - Cities Reached

- **Sentiment-Responsive Ambient UI**
  - Background glow adapts to overall sentiment

- **Analytics & Visualization**
  - Time-series feedback timeline
  - Rating distribution charts
  - Geo-sentiment map highlighting location-specific issues

- **Active Analysis Engine**
  - AI-generated contextual insights per review
  - Priority recommendations surfaced automatically

- **Insights Board**
  - On-demand AI strategist
  - Synthesizes recent feedback into **actionable product plans**

---

## 🧰 Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** FastAPI, Pydantic  
- **Database:** Google Firestore  
- **AI / LLM:** OpenRouter
- **Deployment:** Vercel  

---

## 👤 Author

**Designed and built by**  
**Omkar Haryan**

- 📧 Email: [omkar.djsce27@gmail.com](mailto:omkar.djsce27@gmail.com)  
- 💼 LinkedIn: [omkar-haryan](https://www.linkedin.com/in/omkar-haryan-596a33280/)
---

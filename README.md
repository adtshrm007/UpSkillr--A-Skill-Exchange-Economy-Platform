# UpSkillr — The Tech Learning & Collaboration Ecosystem

**Learn, Teach, and Grow in Tech — All in One Platform.**

UpSkillr is a modern, developer-first platform designed to facilitate peer-to-peer tech learning, mentorship, and community-driven growth. Unlike traditional platforms, UpSkillr treats engineering knowledge as a currency, enabling a circular economy of skill sharing.

---

## 🚀 Product Vision
UpSkillr aims to be the complete tech growth platform where users can:
- **Learn** any tech skill from verified peers or mentors.
- **Teach** others to earn Skill Credits and build reputation.
- **Collaborate** through real-time sessions and community cohorts.
- **Grow** with AI-optimized roadmaps and personalized matching.

---

## ✨ Core Features

### 1. Skill Swap (Peer-to-Peer Learning)
The heart of UpSkillr. Users can find peers to exchange tech skills directly.
- **Mutual Exchange:** Teach a skill you master (e.g., React) in exchange for learning one you need (e.g., System Design).
- **Zero Cost:** Mutual swaps cost 0 credits, rewarding both parties with XP and session history.
- **Real-time Collaboration:** Integrated video calls with chat and shared resources.

### 2. Paid Mentorship (Credit-Based)
Accelerate your career by learning from experienced industry developers.
- **Credit Economy:** Spend **Skill Credits** to book sessions with top-rated mentors.
- **Verified Expertise:** Mentors are ranked based on community reviews and teaching history.
- **Flexible Scheduling:** Book sessions according to mentor availability.

### 3. Tech Communities & Cohorts
Join intensive, bootcamp-style tech communities focused on specific domains.
- **Live Sessions:** Join live collaborative coding and discussion sessions.
- **Resource Sharing:** Access shared notes, recordings, and learning materials.
- **Peer Discussions:** Engage in chat-based discussions within dedicated cohorts.

### 4. AI-Powered Learning Experience
A smart, data-driven layer that optimizes your growth.
- **Personalized Tech Roadmaps:** AI analyzes your Tech Stack and goals to suggest the best next steps.
- **Smart Matching:** Intelligent peer and mentor matching based on compatibility and learning paths.
- **Learning Optimization:** Continuous suggestions to keep your 5-day streak and hit your goals.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js (Vite):** Core UI framework.
- **Vanilla CSS & Tailwind:** Premium, custom-styled Glassmorphic UI.
- **Socket.io-client:** Real-time event handling for chat and notifications.
- **WebRTC:** High-performance, peer-to-peer video streaming for sessions.

### **Backend** (Existing Foundation)
- **Node.js & Express.js:** Scalable server architecture.
- **MongoDB & Mongoose:** Efficient data modeling for users, sessions, and credits.
- **Socket.io:** Signaling server for WebRTC and real-time updates.
- **JWT Authentication:** Secure, stateless user sessions.

---

## 🗓️ Planned Roadmap (Detailed Implementation)

While the UI foundations are laid, the following features are in the active implementation pipeline:

### Phase 1: AI Integration (Backend Logic)
- [ ] **Recommendation Engine:** Implement vector-based matching for "Smart Mentor Matching."
- [ ] **Roadmap Generator:** Integrate LLM APIs to generate dynamic markdown roadmaps based on user profile skills.
- [ ] **Analytics Engine:** Deep dive into "Learning Optimization" metrics (XP velocity, skill gap analysis).

### Phase 2: Enhanced Communities
- [ ] **Cohort Management:** Backend support for creating community-wide events and recurring live sessions.
- [ ] **Knowledge Base:** A repository for "Resource Sharing" where session notes can be permanently stored and tagged.
- [ ] **Group Chat:** Migrating from 1-on-1 session chat to persistent Community Discord-style channels.

### Phase 3: Gamification & Economy
- [ ] **Code Legend Tiers:** Expansion of the rank system (Code Spark → Code Legend) with unique badges and profile cosmetics.
- [ ] **Skill Credit Marketplace:** Ability to purchase or transfer Skill Credits securely.
- [ ] **Global Leaderboard:** Weekly activity tracking for top contributors and learners.

---

## 📂 Project Structure

```text
📦 UpSkillr
 ┣ 📂 client (React / Vite)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components/ui (Premium Glassmorphic Components)
 ┃ ┃ ┣ 📂 pages (Dashboard, LearningRoom, Profile, Explore)
 ┃ ┃ ┣ 📂 context (Auth, Toast, Dashboard states)
 ┃ ┃ ┣ 📂 services (API Abstraction Layer)
 ┃ ┃ ┗ 📜 index.css (Central Design System)
 ┣ 📂 server (Node / Express)
 ┃ ┣ 📂 controllers (Session, User, and Economy Logic)
 ┃ ┣ 📂 models (Mongoose schemas for broad tech domains)
 ┃ ┣ 📂 routes (API Endpoints)
 ┃ ┗ 📜 server.js (Real-time Socket & Signaling Entry)
```

---

## ⚙️ Setup & Installation

1. **Install Dependencies:**
   ```bash
   # Root
   cd client && npm install
   cd ../server && npm install
   ```
2. **Environment Configuration:**
   - Configure `.env` in both `/client` and `/server` (refer to `.env.example`).
3. **Run in Development:**
   ```bash
   # Server (Port 6000)
   npm run dev (in /server)
   # Client (Port 5173)
   npm run dev (in /client)
   ```

---

## 🛡️ Security
- **Perfect Negotiation:** Robust WebRTC signaling for uninterrupted sessions.
- **Stateless Auth:** Secure JWT-based access control.
- **Data Integrity:** Strict Mongoose schemas to ensure consistent credit transactions.

---
*UpSkillr — Master your craft through collaboration.*

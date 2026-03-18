# Skill Swap (UpSkillr)
A peer-to-peer tech skill learning and real-time collaboration platform.

## 🚀 Overview
Skill Swap (also known as UpSkillr) is a platform designed for users to teach and learn tech skills from each other. Users can book sessions with mentors, perform mutual "skill swaps," and engage in real-time video calls with integrated chat and document sharing. The platform features an automated ranking system ("Code Spark" to "Code Legend"), a credit-based economy, and a robust review system.

## ✨ Key Features
- **Authentication & Profiles:** Secure JWT authentication with deep user profiles showcasing teaching/learning skills and availability.
- **Skill Economy:** Users earn credits for teaching sessions, which can be spent to book learning sessions. Mutual swaps cost 0 credits and reward both parties equally based on actual call duration.
- **Automated Progression:** Users dynamically rank up across 7 prestige levels based on sessions completed, hours taught, and absolute reputation score.
- **Learning Rooms:** Real-time, in-browser WebRTC video calls powered by Socket.io signaling. Features include "Perfect Negotiation" to prevent call drops, camera/mic toggling, and integrated chat.
- **Reviews & Ratings:** In-call interactive review UI that triggers immediately upon session completion to capture instantaneous feedback.
- **Real-time Notifications:** In-app push notifications for bookings, cancellations, rank-ups, and credit transaction receipts.

## 🛠️ Tech Stack
### **Frontend**
- **React.js (Vite):** Core UI framework
- **Tailwind CSS:** Utility-first styling with custom animations
- **React Router:** Client-side routing
- **Socket.io-client:** Real-time event handling
- **Axios:** API communication with built-in token interceptors
- **WebRTC:** Native browser peer-to-peer video streaming

### **Backend**
- **Node.js & Express.js:** Server framework
- **MongoDB & Mongoose:** Database and ODM (featuring compound indexes for high-performance skill searches)
- **Socket.io:** Real-time event broadcasting (signaling, notifications, chat)
- **JWT & bcryptjs:** Secure stateless authentication and password hashing

## 📂 Project Structure

```text
📦 Skill Swap
 ┣ 📂 client (React / Vite)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components (Reusable UI components, Navbar, Modals)
 ┃ ┃ ┣ 📂 context (Global state like AuthProvider, ToastProvider)
 ┃ ┃ ┣ 📂 hooks (Custom React Hooks, useSocket)
 ┃ ┃ ┣ 📂 pages (Dashboard, LearningRoom, Profile, etc.)
 ┃ ┃ ┣ 📂 services (API abstraction layers: auth.service, session.service, etc.)
 ┃ ┃ ┗ 📜 App.jsx & main.jsx
 ┃ ┗ 📜 tailwind.config.js / vite.config.js
 ┣ 📂 server (Node / Express)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controllers (Business logic for sessions, users, reviews)
 ┃ ┃ ┣ 📂 middleware (Auth verification, validators)
 ┃ ┃ ┣ 📂 models (Mongoose schemas: User, Session, Review, CreditTransaction)
 ┃ ┃ ┣ 📂 routes (Express router definitions)
 ┃ ┃ ┗ 📂 utils (Socket initialization, DB connection, skillLevel scaling logic)
 ┃ ┗ 📜 server.js (Entry point & Socket attach)
```

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "Skill Swap"
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `/server` directory with:*
   ```env
   PORT=6000
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   CLIENT_ORIGIN=http://localhost:5173
   ```
   *Run the server:*
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file in the `/client` directory with:*
   ```env
   VITE_API_URL=http://localhost:6000
   ```
   *Run the client:*
   ```bash
   npm run dev
   ```

## 🛡️ Security & Architecture Notes
- Uses `helmet` to secure HTTP headers, `express-rate-limit` to prevent brute-force attacks, and `cors` strictly bound to the client origin.
- Modern WebRTC "Perfect Negotiation" pattern natively implements rollback logic for asynchronous connection state collisions.
- Event-driven Socket.io architecture ensures real-time UI reactions across disparate connected clients (e.g. updating a learner's screen immediately when a teacher marks a room as complete).

<h1 align="center">CubeForge 🧊</h1>

<p align="center">
  <strong>The Ultimate Companion for Speedcubers</strong>
</p>

## 🎯 Problem Statement

Speedcubing requires meticulous tracking, algorithmic memorization, and consistent practice. Existing timers are often clunky, don't save progress reliably across devices without complicated setups, or lack integrated learning resources for algorithms like F2L, OLL, and PLL. 

**CubeForge** solves this by providing a unified, cloud-synced, and visually stunning web application. It combines a highly responsive WCA-style timer with integrated algorithm training, 3D cube visualizations, and robust progress tracking, ensuring cubers have everything they need to break their personal bests in one place.

## ✨ Features

- **🏆 Real-time Speedcubing Timer:** WCA-compliant inspection phases (15/8/none) with spacebar controls and touch support.
- **☁️ Cloud Sync & Offline Support:** Solves are saved to Firebase Firestore with offline persistence, meaning your data is safe and syncs perfectly across devices.
- **📊 Comprehensive Progress Tracking:** Detailed statistics including PB, Ao5, Ao12, session averages, and interactive charts visualizing your time trends and distributions.
- **📚 Interactive Algorithm Training:** Visual, step-by-step learning modules from beginner methods to advanced CFOP (F2L, OLL, PLL) with live 3D cube rendering.
- **🎲 Dynamic 3D Cube Previews:** Utilizing the `cubing.js` library to visually demonstrate scramble states and algorithm algorithms right in the browser.
- **🔐 User Authentication:** Secure email/password login system powered by Firebase Auth.
- **🎨 Premium UI/UX:** A modern, dark-themed, glassmorphic interface designed for zero distractions.

## 🛠 Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Charts & Data Visualization:** [Recharts](https://recharts.org/)
- **Cube Visualizations & Scrambling:** [cubing.js](https://js.cubing.net/cubing/)
- **Styling:** Vanilla CSS (Modern CSS Variables, Flexbox, Grid)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Hosting / Deployment:** [Vercel](https://vercel.com/)

## 🚀 Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/ranjit-05/cubeforge.git
cd cubeforge
```

### 2. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 3. Firebase Environment Setup
CubeForge uses Firebase. You need to create a project in the [Firebase Console](https://console.firebase.google.com/) and enable **Authentication (Email/Password)** and **Firestore Database**.

Create a `.env` file in the root of the project and add your Firebase credentials (refer to `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start the Development Server
```bash
npm run dev
```
The app will be running at `http://localhost:5173`.

---
> *Tip for deployments: Make sure you add Vercel's rewrite rules for SPAs so that React router handles routes natively without returning 404s on page reloads.*

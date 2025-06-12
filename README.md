<h1 align="center">🔥 TrackEase – Habit Tracker</h1>

<p align="center">
  <em>“Just like an anime hero trains every day, level up your life one habit at a time!”</em> 💪🌟
</p>

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTBtYmtuOGY2OGI5ODRjazRkOWl2YTFqNzE4Z3I4ZGY5MzRoc3Z1biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lw6H7vUDxeyB4UQDV5/giphy.gif" height="200"/>
</p>

<p align="center">
  A minimal and powerful habit tracking web app with <strong>Supabase Auth</strong>, <strong>calendar heatmap</strong>, and <strong>habit leveling system</strong>. Built for consistency and self-growth 📆🚀
</p>

<p align="center">
  <a href="https://chris-habit-tracker.vercel.app/login" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel" />
  </a>
  <img src="https://img.shields.io/badge/Auth-Supabase-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" />
</p>

---

## ✨ Features

- ✅ **Register & Login** with Supabase Auth  
- 📅 **Create and manage** custom habits  
- 🟩 Interactive **calendar heatmap** for habit streaks  
- 🔒 **Lock** daily habit check-ins  
- ⏫ **Level-up system**: Every 10 completions = 1 level  
- 📊 Real-time **habit status tracking**  
- 💾 Persistent storage with **Supabase Database**  
- ⚡ Deployed live on **Vercel**  

---

## 🧱 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, Tailwind CSS                 |
| Auth       | Supabase Auth                       |
| Database   | Supabase PostgreSQL + RPC Functions |
| Hosting    | Vercel                              |

---

## 🚀 Live Demo

🔗 [**TrackEase App**](https://chris-habit-tracker.vercel.app/login) – Try it out!

Create a test account, start a habit, and track it like a hero!

---

## 📸 Screenshots

> *(Add these images in a `/screenshots` folder in your repo)*

```md
![Login Page](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)
![Heatmap Example](./screenshots/heatmap.png)
🧩 How It Works
🔐 Authentication
Secure login/signup via Supabase Email Auth

Session persists via Supabase client

💡 Habit Management
Users can create, edit, and delete habits

Each habit has a calendar heatmap for daily tracking

🎯 Leveling System
Every 10 completions increases the habit level

Level visually represented in the dashboard

📆 Daily Commit & Lock
Check a date to mark habit complete

Once checked, it gets locked to avoid changes

📁 Folder Structure
bash
Copy
Edit
track-ease-habit-main/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/        # Supabase API logic
│   └── App.jsx
├── supabase/            # Supabase client config
├── .env
└── README.md
📦 Getting Started
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/chris-robert-yeslin2006/track-ease-habit-main.git
cd track-ease-habit-main
2. Install dependencies
bash
Copy
Edit
npm install
3. Setup Supabase
Go to Supabase

Create a new project, enable email auth

Set up the required tables: users, habits, logs, levels

Add your keys to .env:

env
Copy
Edit
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
4. Start the app
bash
Copy
Edit
npm run dev
🛡️ Security Notes
Row Level Security (RLS) is enabled in Supabase

Users can only access and edit their data

🙋‍♂️ Author
Chris Robert Yeslin

💼 LinkedIn

📧 robertchemist2006@gmail.com

📷 Instagram – @yeslin_parker

💡 Inspiration
“Like Goku trains every day to surpass his limits, I built TrackEase to track and level up habits one step at a time.”
– Chris 💥

<p align="center">🌱 Start small. Stay consistent. Become legendary. ⚔️</p> ```

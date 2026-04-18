# 🌑 ShadeIn | Anonymous Confession & Sharing Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)
![Deployment](https://img.shields.io/badge/Deployment-Live-success.svg)

**ShadeIn** is a modern web platform where users can share their thoughts anonymously and interact with other confessions without revealing their identity. Built with the MERN stack, it features a comprehensive authorization and administration system.

🔗 **Live Demo:** [shade-in.vercel.app](https://shade-in.vercel.app/)

---------------------------------------------------------------------------

## ✨ Features

* 👤 **Anonymous Sharing:** Share your thoughts freely without any identity disclosure.
* ⏳ **Temporary Content:** Confessions are automatically deleted after a set period using TTL (Time To Live) indexes.
* 🛠️ **Advanced Admin Panel:** A dedicated interface for content moderation, user management, and system control.
* 🎭 **Reaction System:** Interact with confessions using various emojis.
* 🔐 **Secure Authentication:** JWT (JSON Web Token) based login and password reset workflows.
* 📈 **SEO Optimized:** Fully configured meta tags and search engine optimization.

---------------------------------------------------------------------------

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Data Fetching:** Axios

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose

### **DevOps & Others**
* **Hosting:** Vercel (Frontend) & Render (Backend)
* **E-Mail:** EmailJS (For password reset services)

---------------------------------------------------------------------------

## 🚀 Installation & Local Setup

Follow these steps to run the project locally:

** 1. Clone the Repository**
```bash
git clone [https://github.com/uixova/ShadeIn.git](https://github.com/uixova/ShadeIn.git)

```

### 2. Install Dependencies

# For Backend
cd backend && npm install

# For Frontend
cd frontend && npm install

### 3. Configure Environment Variables

- Create .env files in backend/config/ and frontend/ directories and define necessary variables like MONGO_URI, JWT_SECRET, and VITE_API_URL.

### 4. Start the Project

# Start Backend (Port: 5000)
npm start

# Start Frontend (Port: 5173)
npm run dev

## 🛡️ License
This project was created for personal development and portfolio purposes. All rights reserved.

---------------------------------------------------------------------------

Developer: uixova

*** This project was created for personal development purposes. All rights reserved. ***

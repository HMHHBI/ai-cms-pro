# 🚀 AI CMS Pro — Full Stack AI-Powered Content Management System

AI CMS Pro is a modern full-stack Content Management System built with **Laravel (API backend)** and **React (frontend)**, enhanced with AI-driven features for smarter content handling.

This project demonstrates scalable architecture, clean API design, and modern frontend integration.

---

## 📁 Project Structure
```
ai-cms-pro/
```
---

## ⚙️ Tech Stack

### 🖥 Backend
- Laravel (PHP Framework)
- RESTful API
- Authentication (Sanctum / JWT)
- MySQL Database
- Resource Controllers & Validation

### 🌐 Frontend
- React.js
- Axios (API communication)
- State management (Hooks / Context)
- Modern UI Components

### 🧠 AI Integration
- AI-assisted content features
- Extendable AI service layer

---

## 🔐 Features

### 👨‍💻 Authentication
- Secure login & registration
- Token-based authentication
- Protected routes

### 📝 Content Management
- Create, edit, delete posts
- Manage content efficiently
- Structured data handling

### 🧠 AI Features
- AI-assisted content generation (extendable)
- Smart workflows for content creation

### 🎯 Frontend Features
- Clean and responsive UI
- Admin dashboard
- Dynamic routing
- API-driven architecture

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/HMHHBI/ai-cms-pro.git
cd ai-cms-pro
```

### 2️⃣ Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### Backend runs at:
```bash
👉 http://localhost:8000
```

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

#### Frontend runs at:
```bash
👉 http://localhost:3000
```

#### 🔐 Environment Variables
#### Backend (.env)
```bash
APP_NAME=AI-CMS-Pro
APP_URL=http://localhost:8000

DB_DATABASE=your_database
DB_USERNAME=root
DB_PASSWORD=
```
---
## 📡 API Overview
#### Auth
- POST /api/register
- POST /api/login
#### Content
- GET /api/posts
- POST /api/posts
- PUT /api/posts/{id}
- DELETE /api/posts/{id}
### 🧠 What This Project Demonstrates
- Full-stack application architecture
- API-driven frontend/backend separation
- Authentication systems
- Scalable CMS design
- AI integration concepts
### 🚀 Future Improvements
- Role-based access (Admin/User)
- AI-powered recommendations
- Image upload (cloud storage)
- Pagination & search
- Deployment (Docker / Cloud)
---
## 👨‍💻 Author

Hassan (HMHHBI)

GitHub: https://github.com/HMHHBI

---
## ⭐ Support

If you like this project, consider giving it a ⭐

It helps support future improvements 🚀

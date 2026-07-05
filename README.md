# Cograd Pathshala

This  repository is split into two main sections:
- **`frontend/`**:The frontend React app powered by Vite and Tailwind CSS.
- **`backend/`**: The backend services powered by Node.js, Express, and CORS.

---

## Directory Structure

```
cograd-pathshala/
├── frontend/               # React client application
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── ...
├── backend/                # Express API application
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   ├── .gitignore
│   └── .env.example
├── .gitignore              # Global workspace gitignore
└── README.md               # Root workspace documentation
```

---

## Setup & Running Guide

### 1. Frontend

To install and run the React frontend:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### 2. Backend

To install and run the Express backend:

```bash
# Navigate to the backend directory
cd backend

# Create .env from the template
cp .env.example .env

# Install dependencies
npm install

# Run in development mode (re-starts on save using nodemon)
npm run dev

# Run in production mode
npm run start
```

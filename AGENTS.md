# Repository Instructions

## Architecture Overview

This is a full-stack capstone project for a car dealership review system with four components:

1. **Django Backend** (`server/djangoproj/`, `server/djangoapp/`)
   - Main entry: `server/manage.py`
   - Settings: `djangoproj/settings.py`
   - App: `djangoapp/` (views, models, REST APIs)
   - Serves React app via template views

2. **React Frontend** (`server/frontend/`)
   - Created with Create React App
   - Components: `src/components/` (Login, Register, Dealers)
   - Routes: `/login`, `/register`, `/dealers`, `/dealer/:id`, `/postreview/:id`

3. **MongoDB Node.js API** (`server/database/`)
   - Entry: `app.js` (Express server on port 3030)
   - Models: `dealership.js`, `review.js`, `inventory.js`
   - Seed data: `data/*.json`

4. **Sentiment Analyzer Microservice** (`server/djangoapp/microservices/`)
   - Flask app on port 5050
   - Uses NLTK VADER sentiment analysis
   - Entry: `microservices/app.py`

## Required Services

```bash
# 1. MongoDB (via Docker)
cd server/database
docker-compose up -d

# 2. Node.js API (MongoDB backend)
cd server/database
node app.js  # Port 3030

# 3. Django Backend
cd server
python manage.py runserver  # Port 8000

# 4. Sentiment Analyzer (optional)
cd server/djangoapp/microservices
python app.py  # Port 5050
```

## Key Commands

```bash
# Run auth tests (Django must be running)
cd server
python tests/test_auth_flow.py
# OR
python run_auth_test.py

# Frontend development
cd server/frontend
npm start      # Dev server on port 3000
npm run build  # Build for production
npm test       # Run React tests

# Django management
cd server
python manage.py migrate
python manage.py createsuperuser
```

## Environment Variables

File: `server/djangoapp/.env`
```
backend_url=http://localhost:3030
sentiment_analyzer_url=http://localhost:5050/
```

## Important Notes

- Django serves the pre-built React app from `frontend/build/` via template views
- The `.env` file in `djangoapp/` must be configured for backend services
- Auth tests require Django server to be running on port 8000
- MongoDB connection is hardcoded to `mongodb://mongo_db:27017/` in `database/app.js`
- The `database/data/` directory contains seed JSON files for dealerships and reviews

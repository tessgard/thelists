# List Making App

A full-stack list making application with Django REST API backend (listAPI) and React frontend (listUI).

## Project Structure

```
my-project/
├── backend/          # Django project (listAPI)
│   ├── manage.py
│   ├── requirements.txt
│   ├── listAPI/
│   └── venv/
├── frontend/         # React app (listUI)
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── node_modules/
└── README.md
```

## Setup Instructions

### Backend (Django)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Frontend (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Development

- Backend runs on `http://localhost:8000`
- Frontend runs on `http://localhost:3000`
- Make sure both servers are running for full functionality

# Deployment Guide for The Lists

This guide will help you deploy your application to Railway (backend) and Vercel (frontend).

## Prerequisites

- Git repository for your code
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)

## Part 1: Deploy Backend to Railway

### 1. Prepare Your Backend

All configuration files are already created:
- ✅ `requirements.txt` - Updated with production dependencies
- ✅ `Procfile` - Deployment commands
- ✅ `runtime.txt` - Python version
- ✅ `railway.toml` - Railway configuration
- ✅ `listAPI/production_settings.py` - Production settings
- ✅ `.env.example` - Environment variables template

### 2. Generate a New SECRET_KEY

Run this command in the backend directory:
```bash
cd backend
python3 generate_secret_key.py
```
Copy the output - you'll need it for Railway environment variables.

### 3. Deploy to Railway

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository
5. Railway will auto-detect it's a Django app

### 4. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` environment variable

### 5. Set Environment Variables

In Railway project settings, add these environment variables:
- `DJANGO_SETTINGS_MODULE` = `listAPI.production_settings`
- `SECRET_KEY` = (paste the key from step 2)
- `DEBUG` = `False`
- `FRONTEND_URL` = (leave blank for now, will update after deploying frontend)
- `ALLOWED_HOSTS` = (leave blank, Railway sets this automatically)

### 6. Deploy

Railway will automatically deploy. Once done, copy your Railway app URL (e.g., `https://your-app.railway.app`)

## Part 2: Deploy Frontend to Vercel

### 1. Update Frontend Environment Variable

In Vercel, you'll need to set:
- `REACT_APP_API_URL` = `https://your-railway-app.railway.app/api`

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)

### 3. Add Environment Variable

In Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add `REACT_APP_API_URL` with your Railway backend URL + `/api`
3. Example: `https://your-app.railway.app/api`

### 4. Deploy

Click "Deploy" and Vercel will build and deploy your app.

## Part 3: Connect Frontend and Backend

### 1. Update Backend with Frontend URL

Go back to Railway:
1. Open your project settings
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Example: `https://your-app.vercel.app`
4. Railway will redeploy automatically

### 2. Test Your Deployment

1. Visit your Vercel URL
2. Try logging in
3. Create a list
4. Everything should work!

## Local Development

Your local development environment remains unchanged:
- Backend: `python3 manage.py runserver` (uses SQLite)
- Frontend: `npm start` (uses http://localhost:8000)

The production settings only activate when `DJANGO_SETTINGS_MODULE=listAPI.production_settings` is set.

## Troubleshooting

### Backend Issues

**Check Railway logs:**
- Go to your Railway project → "Deployments" → Click latest deployment → "View Logs"

**Common issues:**
- Missing environment variables
- CORS errors: Make sure `FRONTEND_URL` is set correctly
- Database errors: Ensure PostgreSQL is added and connected

### Frontend Issues

**Check Vercel logs:**
- Go to your Vercel project → "Deployments" → Click latest → "Building" or "Runtime Logs"

**Common issues:**
- API connection errors: Verify `REACT_APP_API_URL` is set correctly
- CORS errors: Backend needs frontend URL in `FRONTEND_URL`

### CORS Errors

If you see CORS errors in the browser console:
1. Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly (including https://)
2. Make sure both apps are using HTTPS in production
3. Check Railway logs for any startup errors

## Database Management

### Run Migrations on Railway

Railway automatically runs migrations on each deployment (see Procfile).

To manually run commands:
1. In Railway, go to your project
2. Click on your service
3. Go to "Settings" → "Deploy" → "Custom Start Command"
4. Or use Railway CLI

### Create a Superuser

Use Railway's CLI or connect to the database directly:
```bash
railway run python manage.py createsuperuser
```

## Updating Your App

### Backend Updates
1. Push changes to GitHub
2. Railway auto-deploys from your main branch

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys from your main branch

## Environment Variables Reference

### Backend (Railway)
| Variable | Value | Notes |
|----------|-------|-------|
| DJANGO_SETTINGS_MODULE | listAPI.production_settings | Required |
| SECRET_KEY | (generated key) | Required, keep secret |
| DEBUG | False | Should be False in production |
| FRONTEND_URL | https://your-app.vercel.app | Your Vercel URL |
| DATABASE_URL | (auto-set by Railway) | Auto-configured when you add Postgres |
| RAILWAY_PUBLIC_DOMAIN | (auto-set by Railway) | Auto-configured |

### Frontend (Vercel)
| Variable | Value | Notes |
|----------|-------|-------|
| REACT_APP_API_URL | https://your-app.railway.app/api | Your Railway URL + /api |

## Security Notes

- Never commit `.env` files with production secrets
- The SECRET_KEY in `settings.py` is only for local development
- Generate a new SECRET_KEY for production
- Keep DEBUG=False in production
- Railway and Vercel environment variables are encrypted and secure

## Need Help?

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Django deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

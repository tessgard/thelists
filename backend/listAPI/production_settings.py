"""
Production settings for listAPI project.
This file extends the base settings.py for production deployments.
"""

import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file (for local testing of production settings)
load_dotenv()

# Import all settings from base settings
from .settings import *

# Override settings for production
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Security settings
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)

# Allowed hosts - Railway provides this automatically
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
if 'RAILWAY_PUBLIC_DOMAIN' in os.environ:
    ALLOWED_HOSTS.append(os.environ['RAILWAY_PUBLIC_DOMAIN'])

# Database - Railway provides DATABASE_URL automatically
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ['DATABASE_URL'],
            conn_max_age=600,
            conn_health_checks=True,
        )
    }

# Static files handling with WhiteNoise
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# CORS settings for production
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
CORS_ALLOWED_ORIGINS = [FRONTEND_URL]
if FRONTEND_URL.startswith('https://'):
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL.replace('https://', 'http://'))

# Additional CORS settings for debugging
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Allow all origins in debug mode
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF settings
CSRF_TRUSTED_ORIGINS = [FRONTEND_URL]
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript access to CSRF cookie
CSRF_COOKIE_AGE = 60 * 60 * 24 * 7  # 1 week
CSRF_USE_SESSIONS = False  # Use cookie-based CSRF tokens

# Session cookie settings for production
if not DEBUG:
    # Session cookies for cross-origin requests (Vercel frontend → Railway backend)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'  # Required for cross-origin cookies
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_DOMAIN = None  # Let Django auto-detect

    # CSRF cookies for cross-origin requests
    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_SAMESITE = 'None'  # Required for cross-origin cookies
    CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript access to CSRF cookie
    CSRF_COOKIE_DOMAIN = None  # Let Django auto-detect

    # Don't force SSL redirect - Railway handles SSL termination at proxy level
    # SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    # Development settings - more permissive
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SECURE = False
    CSRF_COOKIE_SAMESITE = 'Lax'

# Use Python 3.12
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port (Railway will override this with PORT env var)
EXPOSE 8000

# Run migrations and start gunicorn at runtime (not build time)
CMD python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    echo "PORT environment variable is: $PORT" && \
    echo "Starting gunicorn on 0.0.0.0:$PORT" && \
    gunicorn listAPI.wsgi \
      --bind 0.0.0.0:${PORT:-8000} \
      --workers 2 \
      --timeout 120 \
      --access-logfile - \
      --error-logfile - \
      --log-level info

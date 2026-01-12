# backend/Dockerfile — pinned to Python 3.11
FROM python:3.11-slim

# set a non-root user (optional but good practice)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# system deps for common Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc git curl libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY ./requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy app code
COPY . /app

# Expose the port Render will map to $PORT
EXPOSE 10000

# When running on Render, it will set PORT env. Use uvicorn to bind to 0.0.0.0:$PORT
CMD ["bash", "-lc", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]

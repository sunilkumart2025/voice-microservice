# Use a slim, stable Python base image
FROM python:3.11-slim

# Install system dependencies required for audio processing and ML runtimes
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    & apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working execution space inside the container
WORKDIR /code

# Copy the dependency sheet first to leverage Docker layer caching
COPY ./requirements.txt /code/requirements.txt

# Install all pinned application binaries directly into global space
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r /code/requirements.txt

# Copy the rest of your application code layers
COPY . /code/

# Expose Railway's dynamic injection port variable
EXPOSE 8000

# Fire up the Uvicorn engine bound to Railway's automated network layer
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
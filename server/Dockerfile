# Base image for the backend
FROM python:3.12-slim AS backend

# Install dependencies including PortAudio, OpenCV, and other necessary libraries
RUN apt-get update && apt-get install -y \
    portaudio19-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    gcc \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory for backend
WORKDIR /

# Copy only requirements file to leverage Docker layer caching
COPY requirements.txt ./requirements.txt

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy backend source code
COPY . .

# Expose the port the backend runs on
EXPOSE 5000

# Use a production-ready server
CMD ["python", "app.py"]
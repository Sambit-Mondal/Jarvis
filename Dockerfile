# Base image for the frontend
FROM node:22 AS frontend

# Set working directory for frontend
WORKDIR /client

# Copy frontend package.json and package-lock.json
COPY client/package*.json ./

# Install frontend dependencies
RUN npm i

# Copy frontend source code
COPY client/ ./
COPY client/ .env/

# Expose the port the frontend runs on (default Vite port)
EXPOSE 3005

# Start the frontend application
CMD ["npm", "start"]

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
WORKDIR /server

# Copy backend requirements file and install dependencies
COPY server/requirements.txt ./
RUN pip install -r requirements.txt

# Copy backend source code
COPY server/ ./
COPY server/ .env/

# Expose the port the backend runs on
EXPOSE 5000

# Run the backend application
CMD ["python", "app.py"]
# Base image for the frontend
FROM node:18 AS frontend

# Set working directory for frontend
WORKDIR /client

# Copy frontend package.json and package-lock.json
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY client/ ./

# Expose the port the frontend runs on (default Vite port)
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]

# Base image for the backend
FROM python:3.11-slim AS backend

# Install PortAudio dependencies and other tools
RUN apt-get update && apt-get install -y \
    portaudio19-dev \
    gcc \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory for backend
WORKDIR /server

# Copy backend requirements file and install dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY server/ ./

# Expose the port the backend runs on
EXPOSE 5000

# Run the backend application
CMD ["python", "app.py"]
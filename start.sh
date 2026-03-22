#!/bin/bash

echo ""
echo "========================================"
echo "  LMS System - Surigao del Norte"
echo "========================================"
echo ""

# Check .env
if [ ! -f "backend/.env" ]; then
  echo "[ERROR] backend/.env not found."
  echo "Run: cp backend/.env.example backend/.env"
  echo "Then fill in your DB credentials."
  exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "[ERROR] Node.js not installed. Install Node.js 18+ first."
  exit 1
fi

# Install deps if needed
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Start backend in background
echo "Starting backend on port 5000..."
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

sleep 3

# Start frontend in background
echo "Starting frontend on port 3000..."
cd frontend && npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  LMS is running!"
echo "  Backend:  http://localhost:5000/api"
echo "  Frontend: http://localhost:3000"
echo "========================================"
echo ""
echo "  Press Ctrl+C to stop all services."
echo ""

# Wait and cleanup on Ctrl+C
trap "echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait

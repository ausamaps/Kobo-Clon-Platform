#!/bin/bash

echo "======================================="
echo "  Kobo Clon Platform - Inicio"
echo "======================================="
echo ""

# Instalar dependencias si no existen
if [ ! -d "backend/node_modules" ]; then
    echo "Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Instalando dependencias del frontend..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "Iniciando servidores..."
echo ""

# Iniciar backend
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar a que inicie el backend
sleep 3

# Iniciar frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Esperar a que inicie el frontend
sleep 4

# Abrir navegador (si está disponible)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173
elif command -v open > /dev/null; then
    open http://localhost:5173
fi

echo ""
echo "======================================="
echo "  Servidores iniciados:"
echo "  Backend:  http://localhost:4000"
echo "  Frontend: http://localhost:5173"
echo "======================================="
echo ""
echo "Para detener, presiona Ctrl+C"
echo ""

# Mantener script corriendo
wait $BACKEND_PID $FRONTEND_PID

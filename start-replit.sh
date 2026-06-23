#!/bin/bash

echo "========================================="
echo "  Kobo Clon Platform - Replit"
echo "========================================="
echo ""

# Instalar backend
echo "📦 Instalando dependencias..."
cd backend
npm install

echo ""
echo "✅ Listo!"
echo ""
echo "========================================="
echo "  🚀 Iniciando servidor..."
echo "========================================="
echo ""

# Iniciar backend
npm start

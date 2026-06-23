#!/bin/bash

echo "========================================="
echo "  Iniciando Kobo Clon Platform"
echo "========================================="
echo ""

# Instalar backend
echo "📦 Instalando backend..."
cd backend
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Error instalando backend"
    exit 1
fi

# Instalar frontend
echo ""
echo "📦 Instalando frontend..."
cd ../frontend
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ Error instalando frontend"
    exit 1
fi

# Construir frontend
echo ""
echo "🔨 Compilando frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error compilando frontend"
    exit 1
fi

# Iniciar backend
echo ""
echo "✅ Instalación completada!"
echo ""
echo "========================================="
echo "  🚀 Iniciando servidor..."
echo "========================================="
echo ""

cd ../backend
npm start

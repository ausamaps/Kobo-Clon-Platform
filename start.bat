@echo off
cls
echo ======================================
echo  Kobo Clon Platform - Inicio
echo ======================================
echo.

:: Instalar dependencias si no existen
if not exist "backend\node_modules" (
    echo Instalando dependencias del backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Instalando dependencias del frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Iniciando servidores...
echo.

:: Iniciar backend en una nueva ventana
start "Backend - Kobo Clon" cmd /k "cd backend && npm run dev"

:: Esperar un poco para que inicie el backend
timeout /t 3 /nobreak

:: Iniciar frontend en una nueva ventana
start "Frontend - Kobo Clon" cmd /k "cd frontend && npm run dev"

:: Abrir navegador
timeout /t 4 /nobreak
start http://localhost:5173

echo.
echo ======================================
echo  Servidores iniciados:
echo  Backend:  http://localhost:4000
echo  Frontend: http://localhost:5173
echo ======================================
echo.
pause

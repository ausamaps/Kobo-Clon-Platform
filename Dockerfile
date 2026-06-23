# Etapa 1: Construir frontend
FROM node:18-alpine AS builder

WORKDIR /app/frontend

# Copiar package.json del frontend
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código del frontend
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./
COPY frontend/vite.config.js ./

# Construir
RUN npm run build

# Etapa 2: Aplicación final (backend + frontend compilado)
FROM node:18-alpine

WORKDIR /app

# Copiar package.json del backend
COPY backend/package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código del backend
COPY backend/src ./src

# Copiar frontend compilado desde la etapa anterior
COPY --from=builder /app/frontend/dist ./dist

# Copiar carpetas de uploads y submissions
RUN mkdir -p uploads submissions

# Exponer puerto
EXPOSE 8080

# Iniciar aplicación
ENV PORT=8080
CMD ["node", "src/server.js"]

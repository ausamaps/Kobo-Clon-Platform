# 📋 Kobo Clon Platform

Plataforma para crear **formularios personalizados** (estilo KoboToolbox). 

Un builder interactivo donde:
1. **Creas formularios** agregando campos (texto, número, foto, ubicación, etc.)
2. **Publicas** el formulario
3. **Los usuarios lo completan** y envían respuestas
4. **Ves todas las respuestas** organizadas en tablas por formulario

Las respuestas se guardan en **archivos JSON separados** para cada submission.

---

## 🚀 Características

✅ **Builder de formularios** — Crea campos dinámicamente  
✅ **Tipos de campos** — Texto, Número, Fecha, Nota, Selección única/múltiple, Foto, Ubicación  
✅ **Respuestas separadas** — Cada respuesta es un archivo JSON independiente  
✅ **Vista de respuestas** — Tabla con todas las respuestas, ordenadas por fecha  
✅ **Fotos** — Sube y previsualiza imágenes  
✅ **Geolocalización** — Captura automática de ubicación (GPS)  

---

## 📁 Estructura

```
kobo_clon_platform/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js       # Lógica de datos
│   │   │   ├── store.js       # Almacenamiento JSON
│   │   │   └── data.json      # Formularios
│   │   ├── routes/
│   │   │   ├── forms.js       # CRUD de formularios
│   │   │   └── submissions.js # CRUD de respuestas
│   │   └── server.js          # Express server
│   ├── submissions/            # Respuestas en JSON separados
│   │   └── form_id/
│   │       └── submission_id.json
│   └── uploads/                # Fotos subidas
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── App.jsx            # Componente principal
│   │   ├── FormBuilder.jsx    # Constructor de formularios
│   │   ├── FormFiller.jsx     # Completador de formularios
│   │   ├── FormResponses.jsx  # Visualizador de respuestas
│   │   ├── FormsList.jsx      # Lista de formularios
│   │   ├── api.js             # Cliente HTTP
│   │   ├── tiposDeCampo.js    # Tipos de campos
│   │   └── App.css            # Estilos
│   └── index.html
```

---

## 🛠️ Instalación

### Requisitos
- Node.js 16+
- npm o yarn

### Opción 1: Script automático (RECOMENDADO)

```bash
# Windows
git clone https://github.com/ausamaps/Kobo-Clon-Platform.git
cd Kobo-Clon-Platform
start.bat

# Mac/Linux
git clone https://github.com/ausamaps/Kobo-Clon-Platform.git
cd Kobo-Clon-Platform
chmod +x start.sh
./start.sh
```

El script automáticamente:
- Instala dependencias
- Inicia backend en http://localhost:4000
- Inicia frontend en http://localhost:5173
- Abre el navegador

### Opción 2: Manual

```bash
# Clonar el repositorio
git clone https://github.com/ausamaps/Kobo-Clon-Platform.git
cd Kobo-Clon-Platform

# Backend (terminal 1)
cd backend
npm install
npm run dev        # Corre en http://localhost:4000

# Frontend (terminal 2)
cd frontend
npm install
npm run dev        # Corre en http://localhost:5173
```

---

## 📖 Cómo usar

1. **Abre** `http://localhost:5173` en tu navegador
2. **Crea un formulario** — Click en "+ Nuevo formulario"
3. **Agrega campos** — Selecciona tipos y pon nombres
4. **Publica** — Botón "Publicar" para que otros lo completen
5. **Completa** — Click en "Completar" para llenar el formulario
6. **Ve respuestas** — Click en "Ver respuestas" para la tabla con todos los datos

---

## 📊 Modelo de datos

### Formularios (data.json)
```json
{
  "id": "uuid",
  "nombre": "Mi Encuesta",
  "descripcion": "...",
  "campos": [
    {
      "id": "uuid",
      "tipo": "texto|numero|fecha|nota|seleccion_unica|seleccion_multiple|foto|ubicacion",
      "etiqueta": "Nombre del campo",
      "requerido": true,
      "opciones": ["opcion1", "opcion2"]  // solo si es selección
    }
  ],
  "estado": "borrador|publicado",
  "creado_en": "2026-06-23T..."
}
```

### Respuestas (submissions/{form_id}/{submission_id}.json)
```json
{
  "id": "uuid",
  "form_id": "uuid",
  "datos": {
    "campo_id": "valor"
  },
  "ubicacion": {
    "lat": -34.6037,
    "lon": -58.3816
  },
  "fotos": ["/uploads/...", "/uploads/..."],
  "creado_en": "2026-06-23T..."
}
```

---

## ☁️ Desplegar en Google Cloud Run

### Requisitos
- Cuenta en [Google Cloud](https://cloud.google.com)
- `gcloud` CLI instalado ([descargar](https://cloud.google.com/sdk/docs/install))

### Pasos

```bash
# 1. Autenticarse
gcloud auth login

# 2. Configurar proyecto (reemplaza PROJECT_ID)
gcloud config set project PROJECT_ID

# 3. Desplegar
gcloud run deploy kobo-clon \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Tu app estará en: https://kobo-clon-XXXXX.run.app
```

**O desde Google Cloud Console:**
1. Ve a Cloud Run
2. Click "Deploy container"
3. Conecta tu repositorio GitHub
4. Selecciona `Kobo-Clon-Platform`
5. Click Deploy

---

## 🔄 Próximos pasos

- [ ] Migración a PostgreSQL/PostGIS
- [ ] Autenticación y permisos
- [ ] Exportar a CSV/JSON
- [ ] Validación avanzada (emails, rangos, regex)
- [ ] Temas y personalización
- [ ] Dashboard con estadísticas

---

## 📝 API Endpoints

### Formularios
- `GET /api/forms` — Listar
- `GET /api/forms/:id` — Obtener
- `POST /api/forms` — Crear
- `PUT /api/forms/:id` — Actualizar
- `POST /api/forms/:id/publicar` — Publicar
- `DELETE /api/forms/:id` — Eliminar

### Respuestas
- `GET /api/submissions?form_id=:id` — Listar por formulario
- `POST /api/submissions` — Crear (multipart: datos, fotos, lat, lon)

---

## 📄 Licencia

MIT

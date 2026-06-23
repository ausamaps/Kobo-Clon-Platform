import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { listSubmissions, createSubmission, getForm } from "../db/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

// Simulación: las fotos se guardan en disco local (backend/uploads).
// Cuando esté el servidor de archivos real, reemplazar este storage por
// la subida a ese servidor (vía FILES_SERVER_URL) y guardar la URL devuelta.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

const router = Router();

router.get("/", (req, res) => {
  const { form_id } = req.query;
  if (!form_id) return res.status(400).json({ error: "Falta form_id" });
  res.json(listSubmissions(form_id));
});

router.post("/", upload.array("fotos", 10), (req, res) => {
  const { form_id, datos, lat, lon } = req.body;

  if (!form_id) return res.status(400).json({ error: "Falta form_id" });
  const form = getForm(form_id);
  if (!form) return res.status(404).json({ error: "Formulario no encontrado" });

  const datosParseados = typeof datos === "string" ? JSON.parse(datos) : datos || {};
  const fotos = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const ubicacion = lat && lon ? { lat: Number(lat), lon: Number(lon) } : null;

  const submission = createSubmission({
    form_id,
    datos: datosParseados,
    ubicacion,
    fotos,
  });

  res.status(201).json(submission);
});

export default router;

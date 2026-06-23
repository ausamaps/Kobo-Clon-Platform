import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import formsRouter from "./routes/forms.js";
import submissionsRouter from "./routes/submissions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API routes
app.use("/api/forms", formsRouter);
app.use("/api/submissions", submissionsRouter);
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Servir frontend compilado (producción)
const frontendPath = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(frontendPath));

// SPA fallback - cualquier ruta desconocida va al index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});

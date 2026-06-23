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

app.use("/api/forms", formsRouter);
app.use("/api/submissions", submissionsRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

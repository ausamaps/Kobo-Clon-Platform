import { Router } from "express";
import {
  listForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
} from "../db/index.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(listForms());
});

router.get("/:id", (req, res) => {
  const form = getForm(req.params.id);
  if (!form) return res.status(404).json({ error: "Formulario no encontrado" });
  res.json(form);
});

router.post("/", (req, res) => {
  const { nombre, descripcion, campos } = req.body;
  if (!nombre) return res.status(400).json({ error: "Falta el nombre del formulario" });
  const form = createForm({ nombre, descripcion, campos });
  res.status(201).json(form);
});

router.put("/:id", (req, res) => {
  const form = updateForm(req.params.id, req.body);
  if (!form) return res.status(404).json({ error: "Formulario no encontrado" });
  res.json(form);
});

router.post("/:id/publicar", (req, res) => {
  const form = updateForm(req.params.id, { estado: "publicado" });
  if (!form) return res.status(404).json({ error: "Formulario no encontrado" });
  res.json(form);
});

router.delete("/:id", (req, res) => {
  const ok = deleteForm(req.params.id);
  if (!ok) return res.status(404).json({ error: "Formulario no encontrado" });
  res.status(204).end();
});

export default router;

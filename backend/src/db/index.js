// Capa de acceso a datos. Formularios en data.json, respuestas en archivos JSON separados
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getData, saveData } from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUBMISSIONS_DIR = path.join(__dirname, "..", "..", "submissions");

function asegurarDirectorio() {
  if (!fs.existsSync(SUBMISSIONS_DIR)) {
    fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
  }
}

function asegurarDirectorioFormulario(formId) {
  const dirForm = path.join(SUBMISSIONS_DIR, formId);
  if (!fs.existsSync(dirForm)) {
    fs.mkdirSync(dirForm, { recursive: true });
  }
}

export function listForms() {
  return getData().formTemplates;
}

export function getForm(id) {
  return getData().formTemplates.find((f) => f.id === id) || null;
}

export function createForm({ nombre, descripcion, campos }) {
  const data = getData();
  const nuevo = {
    id: uuid(),
    nombre,
    descripcion: descripcion || "",
    campos: campos || [],
    estado: "borrador",
    creado_en: new Date().toISOString(),
  };
  data.formTemplates.push(nuevo);
  saveData(data);
  asegurarDirectorioFormulario(nuevo.id);
  return nuevo;
}

export function updateForm(id, cambios) {
  const data = getData();
  const form = data.formTemplates.find((f) => f.id === id);
  if (!form) return null;
  Object.assign(form, cambios);
  saveData(data);
  return form;
}

export function deleteForm(id) {
  const data = getData();
  const antes = data.formTemplates.length;
  data.formTemplates = data.formTemplates.filter((f) => f.id !== id);
  saveData(data);
  return data.formTemplates.length < antes;
}

export function listSubmissions(formId) {
  asegurarDirectorio();
  asegurarDirectorioFormulario(formId);

  const dirForm = path.join(SUBMISSIONS_DIR, formId);
  try {
    const archivos = fs.readdirSync(dirForm).filter((f) => f.endsWith(".json"));
    const respuestas = archivos.map((archivo) => {
      const contenido = fs.readFileSync(path.join(dirForm, archivo), "utf-8");
      return JSON.parse(contenido);
    });
    return respuestas;
  } catch {
    return [];
  }
}

export function createSubmission({ form_id, datos, ubicacion, fotos }) {
  asegurarDirectorio();
  asegurarDirectorioFormulario(form_id);

  const nueva = {
    id: uuid(),
    form_id,
    datos: datos || {},
    ubicacion: ubicacion || null,
    fotos: fotos || [],
    creado_en: new Date().toISOString(),
  };

  const dirForm = path.join(SUBMISSIONS_DIR, form_id);
  const archivoSubmission = path.join(dirForm, `${nueva.id}.json`);
  fs.writeFileSync(archivoSubmission, JSON.stringify(nueva, null, 2));

  return nueva;
}

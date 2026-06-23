// En producción, usa rutas relativas. En desarrollo, apunta a localhost:4000
const BASE_URL = import.meta.env.MODE === "production"
  ? "/api"
  : "http://localhost:4000/api";

export async function listForms() {
  const res = await fetch(`${BASE_URL}/forms`);
  return res.json();
}

export async function getForm(id) {
  const res = await fetch(`${BASE_URL}/forms/${id}`);
  return res.json();
}

export async function createForm(form) {
  const res = await fetch(`${BASE_URL}/forms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return res.json();
}

export async function updateForm(id, cambios) {
  const res = await fetch(`${BASE_URL}/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  return res.json();
}

export async function publicarForm(id) {
  const res = await fetch(`${BASE_URL}/forms/${id}/publicar`, { method: "POST" });
  return res.json();
}

export async function deleteForm(id) {
  await fetch(`${BASE_URL}/forms/${id}`, { method: "DELETE" });
}

export async function enviarSubmission(formId, datos, ubicacion, fotos) {
  const fd = new FormData();
  fd.append("form_id", formId);
  fd.append("datos", JSON.stringify(datos));
  if (ubicacion) {
    fd.append("lat", ubicacion.lat);
    fd.append("lon", ubicacion.lon);
  }
  fotos.forEach((foto) => fd.append("fotos", foto));

  const res = await fetch(`${BASE_URL}/submissions`, {
    method: "POST",
    body: fd,
  });
  return res.json();
}

export async function listSubmissions(formId) {
  const res = await fetch(`${BASE_URL}/submissions?form_id=${formId}`);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

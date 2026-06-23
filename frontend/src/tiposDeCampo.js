export const TIPOS_DE_CAMPO = [
  { tipo: "texto", etiqueta: "Texto" },
  { tipo: "numero", etiqueta: "Número" },
  { tipo: "fecha", etiqueta: "Fecha" },
  { tipo: "nota", etiqueta: "Nota / Observación" },
  { tipo: "seleccion_unica", etiqueta: "Selección única" },
  { tipo: "seleccion_multiple", etiqueta: "Selección varias" },
  { tipo: "foto", etiqueta: "Foto" },
  { tipo: "ubicacion", etiqueta: "Ubicación (punto)" },
];

export function nuevoCampo(tipo) {
  return {
    id: crypto.randomUUID(),
    tipo,
    etiqueta: "",
    requerido: false,
    opciones: tipo === "seleccion_unica" || tipo === "seleccion_multiple" ? [""] : undefined,
  };
}

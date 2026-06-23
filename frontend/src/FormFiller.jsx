import { useEffect, useState } from "react";
import { enviarSubmission } from "./api";

export default function FormFiller({ form, onVolver }) {
  const [valores, setValores] = useState({});
  const [fotos, setFotos] = useState({});
  const [previews, setPreviews] = useState({});
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const camposUbicacion = form.campos.filter((c) => c.tipo === "ubicacion");

  useEffect(() => {
    if (camposUbicacion.length === 0) return;
    if (!navigator.geolocation) {
      setGeoError("Este navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const setValor = (campoId, valor) => {
    setValores((v) => ({ ...v, [campoId]: valor }));
  };

  const agregarFotos = (campoId, archivos) => {
    const actuales = fotos[campoId] || [];
    const combinadas = [...actuales, ...archivos].slice(0, 10);
    setFotos((f) => ({ ...f, [campoId]: combinadas }));
    setPreviews((p) => ({ ...p, [campoId]: combinadas.map((a) => URL.createObjectURL(a)) }));
  };

  const quitarFoto = (campoId, index) => {
    const nuevas = (fotos[campoId] || []).filter((_, i) => i !== index);
    setFotos((f) => ({ ...f, [campoId]: nuevas }));
    setPreviews((p) => ({ ...p, [campoId]: nuevas.map((a) => URL.createObjectURL(a)) }));
  };

  const enviar = async () => {
    for (const campo of form.campos) {
      if (campo.requerido && campo.tipo !== "foto" && !valores[campo.id]) {
        alert(`Falta completar: ${campo.etiqueta}`);
        return;
      }
    }

    const todasLasFotos = Object.values(fotos).flat();
    const ubicacion = lat && lon ? { lat, lon } : null;

    await enviarSubmission(form.id, valores, ubicacion, todasLasFotos);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="card">
        <h2>¡Gracias!</h2>
        <p>Tu respuesta fue enviada correctamente.</p>
        <button className="btn-borrador" onClick={onVolver}>Volver</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>{form.nombre}</h2>
      {form.descripcion && <p className="descripcion-form">{form.descripcion}</p>}

      {form.campos.map((campo) => (
        <div key={campo.id} className="campo-render">
          <label>
            {campo.etiqueta} {campo.requerido && <span className="requerido">*</span>}
          </label>

          {campo.tipo === "texto" && (
            <input value={valores[campo.id] || ""} onChange={(e) => setValor(campo.id, e.target.value)} />
          )}

          {campo.tipo === "numero" && (
            <input
              type="number"
              value={valores[campo.id] || ""}
              onChange={(e) => setValor(campo.id, e.target.value)}
            />
          )}

          {campo.tipo === "fecha" && (
            <input
              type="date"
              value={valores[campo.id] || ""}
              onChange={(e) => setValor(campo.id, e.target.value)}
            />
          )}

          {campo.tipo === "nota" && (
            <textarea
              rows="4"
              value={valores[campo.id] || ""}
              onChange={(e) => setValor(campo.id, e.target.value)}
            />
          )}

          {campo.tipo === "seleccion_unica" && (
            <div className="radio-group">
              {(campo.opciones || []).map((op, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={campo.id}
                    checked={valores[campo.id] === op}
                    onChange={() => setValor(campo.id, op)}
                  />
                  {op}
                </label>
              ))}
            </div>
          )}

          {campo.tipo === "seleccion_multiple" && (
            <div className="radio-group">
              {(campo.opciones || []).map((op, i) => {
                const seleccionadas = valores[campo.id] || [];
                return (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={seleccionadas.includes(op)}
                      onChange={(e) => {
                        const nuevas = e.target.checked
                          ? [...seleccionadas, op]
                          : seleccionadas.filter((x) => x !== op);
                        setValor(campo.id, nuevas);
                      }}
                    />
                    {op}
                  </label>
                );
              })}
            </div>
          )}

          {campo.tipo === "foto" && (
            <div className="field-container">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const archivos = Array.from(e.target.files);
                  e.target.value = "";
                  agregarFotos(campo.id, archivos);
                }}
              />
              <div className="gallery">
                {(previews[campo.id] || []).map((img, index) => (
                  <div key={index} className="gallery-item">
                    <button
                      type="button"
                      className="remove-photo"
                      onClick={() => quitarFoto(campo.id, index)}
                    >
                      ✕
                    </button>
                    <img src={img} alt={`foto-${index}`} className="preview-image" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {campo.tipo === "ubicacion" && (
            <div className="ubicacion-render">
              {geoError && <div className="geo-error">No se pudo obtener la ubicación: {geoError}</div>}
              <input value={lat ? `${lat}, ${lon}` : ""} readOnly placeholder="Obteniendo ubicación…" />
            </div>
          )}
        </div>
      ))}

      <div className="botones">
        <button type="button" className="btn-borrador" onClick={onVolver}>
          Volver
        </button>
        <button type="button" className="btn-enviar" onClick={enviar}>
          Enviar
        </button>
      </div>
    </div>
  );
}

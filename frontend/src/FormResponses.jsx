import { useEffect, useState } from "react";
import { listSubmissions } from "./api";

export default function FormResponses({ form, onVolver }) {
  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listSubmissions(form.id);
        const ordenadas = data.sort(
          (a, b) => new Date(b.creado_en) - new Date(a.creado_en)
        );
        setRespuestas(ordenadas);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [form.id]);

  if (cargando)
    return (
      <div className="card">
        <p>Cargando respuestas...</p>
      </div>
    );
  if (error)
    return (
      <div className="card">
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={onVolver}>Volver</button>
      </div>
    );

  if (respuestaSeleccionada) {
    return (
      <div className="card">
        <button className="btn-volver-detalle" onClick={() => setRespuestaSeleccionada(null)}>
          ← Volver al listado
        </button>
        <h2>Detalle de respuesta</h2>
        <p style={{ color: "#666" }}>
          Fecha: {new Date(respuestaSeleccionada.creado_en).toLocaleString("es-ES")}
        </p>

        <div className="detalle-respuesta">
          {form.campos.map((campo) => {
            const valor = respuestaSeleccionada.datos[campo.id];
            return (
              <div key={campo.id} className="dato-field">
                <label>{campo.etiqueta}</label>
                {campo.tipo === "seleccion_multiple" && Array.isArray(valor) ? (
                  <div className="valor-multiple">
                    {valor.map((v, i) => (
                      <span key={i} className="badge-valor">
                        {v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="valor">{valor || <em>sin respuesta</em>}</p>
                )}
              </div>
            );
          })}

          {respuestaSeleccionada.ubicacion && (
            <div className="dato-field">
              <label>📍 Ubicación</label>
              <p className="valor">
                {respuestaSeleccionada.ubicacion.lat?.toFixed(6)},{" "}
                {respuestaSeleccionada.ubicacion.lon?.toFixed(6)}
              </p>
            </div>
          )}

          {respuestaSeleccionada.fotos &&
            respuestaSeleccionada.fotos.length > 0 && (
              <div className="dato-field">
                <label>📷 Fotos ({respuestaSeleccionada.fotos.length})</label>
                <div className="fotos-respuesta">
                  {respuestaSeleccionada.fotos.map((foto, i) => (
                    <a
                      key={i}
                      href={`http://localhost:4000${foto}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={`http://localhost:4000${foto}`} alt={`foto-${i}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <button
        type="button"
        className="btn-volver-nav"
        onClick={onVolver}
        title="Volver a Mis formularios"
      >
        ← Mis formularios
      </button>

      <h2>Respuestas: {form.nombre}</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Total de registros: <strong>{respuestas.length}</strong>
      </p>

      {respuestas.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", margin: "30px 0" }}>
          Aún no hay respuestas cargadas.
        </p>
      ) : (
        <div className="tabla-respuestas">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                {form.campos.slice(0, 3).map((campo) => (
                  <th key={campo.id}>{campo.etiqueta}</th>
                ))}
                {form.campos.length > 3 && <th>...</th>}
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {respuestas.map((resp, idx) => (
                <tr key={resp.id}>
                  <td className="num-columna">{idx + 1}</td>
                  <td className="fecha-columna">
                    {new Date(resp.creado_en).toLocaleString("es-ES")}
                  </td>
                  {form.campos.slice(0, 3).map((campo) => {
                    const valor = resp.datos[campo.id];
                    return (
                      <td key={campo.id} className="dato-columna">
                        {campo.tipo === "seleccion_multiple" && Array.isArray(valor)
                          ? valor.join(", ")
                          : valor || "-"}
                      </td>
                    );
                  })}
                  {form.campos.length > 3 && <td>Ver más</td>}
                  <td>
                    <button
                      className="btn-ver-detalle"
                      onClick={() => setRespuestaSeleccionada(resp)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="botones" style={{ marginTop: "20px" }}>
        <button type="button" className="btn-borrador" onClick={onVolver}>
          Volver
        </button>
      </div>
    </div>
  );
}

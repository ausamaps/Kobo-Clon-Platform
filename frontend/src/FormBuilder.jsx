import { useState } from "react";
import { TIPOS_DE_CAMPO, nuevoCampo } from "./tiposDeCampo";
import { createForm, updateForm, publicarForm } from "./api";

export default function FormBuilder({ formInicial, onGuardado, onCancelar }) {
  const [id, setId] = useState(formInicial?.id || null);
  const [nombre, setNombre] = useState(formInicial?.nombre || "");
  const [descripcion, setDescripcion] = useState(formInicial?.descripcion || "");
  const [campos, setCampos] = useState(formInicial?.campos || []);
  const [mostrarTipos, setMostrarTipos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const agregarCampo = (tipo) => {
    setCampos([...campos, nuevoCampo(tipo)]);
    setMostrarTipos(false);
  };

  const actualizarCampo = (id, cambios) => {
    setCampos(campos.map((c) => (c.id === id ? { ...c, ...cambios } : c)));
  };

  const eliminarCampo = (id) => {
    setCampos(campos.filter((c) => c.id !== id));
  };

  const moverCampo = (index, direccion) => {
    const destino = index + direccion;
    if (destino < 0 || destino >= campos.length) return;
    const nuevos = [...campos];
    [nuevos[index], nuevos[destino]] = [nuevos[destino], nuevos[index]];
    setCampos(nuevos);
  };

  const guardar = async (publicar) => {
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre del formulario es obligatorio");
      return;
    }

    setGuardando(true);
    try {
      let form;
      if (id) {
        form = await updateForm(id, { nombre, descripcion, campos });
      } else {
        form = await createForm({ nombre, descripcion, campos });
        setId(form.id);
      }

      if (publicar) {
        console.log("Publicando formulario con ID:", form.id);
        form = await publicarForm(form.id);
        console.log("Formulario publicado:", form);
      }

      onGuardado(form);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="builder">
      <h2>{id ? "Editar formulario" : "Nuevo formulario"}</h2>

      <label>Nombre del formulario</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>Descripción</label>
      <textarea rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <h3>Campos</h3>

      <div className="lista-campos">
        {campos.map((campo, index) => (
          <CampoEditor
            key={campo.id}
            campo={campo}
            onCambiar={(cambios) => actualizarCampo(campo.id, cambios)}
            onEliminar={() => eliminarCampo(campo.id)}
            onSubir={() => moverCampo(index, -1)}
            onBajar={() => moverCampo(index, 1)}
          />
        ))}
      </div>

      {!mostrarTipos && (
        <button type="button" className="btn-agregar-campo" onClick={() => setMostrarTipos(true)}>
          + Agregar campo
        </button>
      )}

      {mostrarTipos && (
        <div className="selector-tipos">
          <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px 0", fontWeight: "600" }}>
            Selecciona el tipo de campo a agregar:
          </p>
          {TIPOS_DE_CAMPO.map((t) => (
            <button
              key={t.tipo}
              type="button"
              className="tipo-campo-btn"
              onClick={() => agregarCampo(t.tipo)}
              title={t.etiqueta}
            >
              <span className="tipo-icono">📋</span>
              {t.etiqueta}
            </button>
          ))}
          <button type="button" className="cancelar-tipo" onClick={() => setMostrarTipos(false)}>
            ✕ Cancelar
          </button>
        </div>
      )}

      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <div className="botones">
        <button type="button" className="btn-borrador" onClick={onCancelar} disabled={guardando}>
          Volver
        </button>
        <button type="button" className="btn-borrador" onClick={() => guardar(false)} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar borrador"}
        </button>
        <button type="button" className="btn-enviar" onClick={() => guardar(true)} disabled={guardando}>
          {guardando ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}

function CampoEditor({ campo, onCambiar, onEliminar, onSubir, onBajar }) {
  const tieneOpciones = campo.tipo === "seleccion_unica" || campo.tipo === "seleccion_multiple";
  const tipoLabel = TIPOS_DE_CAMPO.find((t) => t.tipo === campo.tipo)?.etiqueta;
  const etiqueta = campo.etiqueta || "(sin nombre)";

  return (
    <div className="campo-editor">
      <div className="campo-editor-header">
        <span className="campo-tipo-badge">
          {tipoLabel} - {etiqueta}
        </span>
        <div className="campo-editor-acciones">
          <button type="button" onClick={onSubir} title="Subir">↑</button>
          <button type="button" onClick={onBajar} title="Bajar">↓</button>
          <button type="button" onClick={onEliminar} title="Eliminar">✕</button>
        </div>
      </div>

      <input
        placeholder="Etiqueta del campo"
        value={campo.etiqueta}
        onChange={(e) => onCambiar({ etiqueta: e.target.value })}
      />

      {tieneOpciones && (
        <div className="opciones-editor">
          {campo.opciones.map((op, i) => (
            <div key={i} className="opcion-row">
              <input
                placeholder={`Opción ${i + 1}`}
                value={op}
                onChange={(e) => {
                  const nuevas = [...campo.opciones];
                  nuevas[i] = e.target.value;
                  onCambiar({ opciones: nuevas });
                }}
              />
              <button
                type="button"
                onClick={() => onCambiar({ opciones: campo.opciones.filter((_, idx) => idx !== i) })}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onCambiar({ opciones: [...campo.opciones, ""] })}>
            + Opción
          </button>
        </div>
      )}

      <label className="check-requerido">
        <input
          type="checkbox"
          checked={campo.requerido}
          onChange={(e) => onCambiar({ requerido: e.target.checked })}
        />
        Obligatorio
      </label>
    </div>
  );
}

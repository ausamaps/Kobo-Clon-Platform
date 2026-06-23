import { deleteForm } from "./api";

export default function FormsList({ forms, onNuevo, onEditar, onCompletar, onRecargar, onVerResponses }) {
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este formulario?")) return;
    await deleteForm(id);
    onRecargar();
  };

  return (
    <div className="card">
      <h2>Mis formularios</h2>

      <button type="button" className="btn-enviar" onClick={onNuevo}>
        + Nuevo formulario
      </button>

      <div className="lista-formularios">
        {forms.length === 0 && <p>Todavía no creaste ningún formulario.</p>}

        {forms.map((form) => (
          <div key={form.id} className="form-item">
            <div className="form-item-info">
              <strong>{form.nombre}</strong>
              <span className={`badge-estado ${form.estado}`}>{form.estado}</span>
              <span className="campo-count">{form.campos.length} campos</span>
            </div>
            <div className="form-item-acciones">
              {form.estado === "publicado" && (
                <>
                  <button type="button" onClick={() => onCompletar(form)}>
                    Completar
                  </button>
                  <button type="button" onClick={() => onVerResponses(form)}>
                    Ver respuestas
                  </button>
                </>
              )}
              <button type="button" onClick={() => onEditar(form)}>
                Editar
              </button>
              <button type="button" className="btn-eliminar" onClick={() => eliminar(form.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

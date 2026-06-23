import { useEffect, useState } from "react";
import "./App.css";
import { listForms } from "./api";
import FormsList from "./FormsList";
import FormBuilder from "./FormBuilder";
import FormFiller from "./FormFiller";
import FormResponses from "./FormResponses";

export default function App() {
  const [vista, setVista] = useState("lista"); // lista | builder | filler | respuestas
  const [forms, setForms] = useState([]);
  const [formActivo, setFormActivo] = useState(null);

  const cargarForms = async () => {
    setForms(await listForms());
  };

  useEffect(() => {
    cargarForms();
  }, []);

  return (
    <div className="page">
      {vista === "lista" && (
        <FormsList
          forms={forms}
          onRecargar={cargarForms}
          onNuevo={() => {
            setFormActivo(null);
            setVista("builder");
          }}
          onEditar={(form) => {
            setFormActivo(form);
            setVista("builder");
          }}
          onCompletar={(form) => {
            setFormActivo(form);
            setVista("filler");
          }}
          onVerResponses={(form) => {
            setFormActivo(form);
            setVista("respuestas");
          }}
        />
      )}

      {vista === "builder" && (
        <FormBuilder
          formInicial={formActivo}
          onCancelar={() => setVista("lista")}
          onGuardado={async () => {
            await cargarForms();
            setVista("lista");
          }}
        />
      )}

      {vista === "filler" && formActivo && (
        <FormFiller form={formActivo} onVolver={() => setVista("lista")} />
      )}

      {vista === "respuestas" && formActivo && (
        <FormResponses form={formActivo} onVolver={() => setVista("lista")} />
      )}
    </div>
  );
}

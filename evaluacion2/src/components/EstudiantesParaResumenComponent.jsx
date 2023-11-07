import React, { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function EstudiantesParaResumenComponent() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/cuota/estudiantes")
      .then((response) => response.json())
      .then((data) => setEstudiantes(data));
  }, []);

  const handleSelectEstudiante = (estudiante) => {
    setSelectedEstudiante(estudiante);
    navigate(`/ver-resumen/${estudiante.id}`);
  };

  return (
    <div className="home">
      <NavbarComponent />
      <Styles>
        <h1 className="text-center">
          <b>Estudiantes con resumen disponible</b>
        </h1>
        <div className="f">
          <table border="1" className="content-table">
            <thead>
              <tr>
                <th>Rut</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Fecha de Nacimiento</th>
                <th>Nombre del colegio</th>
                <th>Tipo de colegio</th>
                <th>Año de egreso</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.rut}>
                  <td>{estudiante.rut}</td>
                  <td>{estudiante.nombres}</td>
                  <td>{estudiante.apellidos}</td>
                  <td>{formatDate(estudiante.fechaNacimiento)}</td>
                  <td>{estudiante.nombreColegio}</td>
                  <td>{estudiante.tipoColegioProcedencia}</td>
                  <td>{estudiante.anioEgreso}</td>
                  <td>
                    <Button className="boton" onClick={() => handleSelectEstudiante(estudiante)}>Ver resumen</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedEstudiante}
      </Styles>
    </div>
  );
}

export default EstudiantesParaResumenComponent;

const Styles = styled.div`


.text-center {
    text-align: center;
    justify-content: center;
    padding-top: 8px;
    font-family: "Arial Black", Gadget, sans-serif;
    font-size: 30px;
    letter-spacing: 0px;
    word-spacing: 2px;
    color: #000000;
    font-weight: 700;
    text-decoration: none solid rgb(68, 68, 68);
    font-style: normal;
    font-variant: normal;
    text-transform: uppercase;
}

.payment-panel {
    background-color: #f9f9f9;
    padding: 20px;
    border: 1px solid #ddd;
    margin-top: 20px;
  }
  .payment-panel button {
    margin: 5px;
  }

.f{
    justify-content: center;
    align-items: center;
    display: flex;
}
*{
    font-family: sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
.content-table{
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    min-width: 400px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.content-table thead tr{
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    font-weight: bold;
}
.content-table th,
.content-table td{
    padding: 12px 15px;
}
.content-table tbody tr{
    border-bottom: 1px solid #dddddd;
}
.content-table tbody tr:nth-of-type(even){
    background-color: #f3f3f3;
}
.content-table tbody tr:last-of-type{
    border-bottom: 2px solid #009879;
}
.content-table tbody tr.active-row{
    font-weight: bold;
    color: #009879;
}
`
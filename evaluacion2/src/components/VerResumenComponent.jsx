import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NavbarComponent from "./Navbar3Component";
import styled from "styled-components";
import EstudianteService from "../services/EstudianteService";

function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function VerResumenComponent() {
  const { id } = useParams();
  const [resumen, setResumen] = useState({});

  useEffect(() => {
    EstudianteService.ResumenEstudiante(id)
      .then((response) => {
        setResumen(response.data); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="home">
      <NavbarComponent />
      <Styles>
        <div className="container-ajuste f">
          <h2 className="text-center">Resumen</h2>
          <table className="content-table">
            <tr>
              <th>Rut estudiante: </th>
              <td>{resumen.estudiante ? resumen.estudiante.rut : 'No disponible'}</td>
            </tr>
            <tr>
              <th>Apellidos del estudiante: </th>
              <td>{resumen.estudiante ? resumen.estudiante.apellidos : 'No disponible'}</td>
            </tr>
            <tr>
              <th>Nombres del estudiante: </th>
              <td>{resumen.estudiante ? resumen.estudiante.nombres : 'No disponible'}</td>
            </tr>
            <tr>
              <th>Nro. exámenes rendidos: </th>
              <td>{resumen.estudiante ? resumen.estudiante.cantidadExamenes : 'No disponible'}</td>
            </tr>
            <tr>
              <th>Promedio puntaje exámenes: </th>
              <td>{resumen.promedioExamenesTotales}</td>
            </tr>
            <tr>
              <th>Monto total arancel a pagar: </th>
              <td>${resumen.montoTotalArancelPagar}</td>
            </tr>
            <tr>
              <th>Tipo pago: </th>
              <td>{resumen.tipoPago}</td>
            </tr>
            <tr>
              <th>Nro. total de cuotas pactadas: </th>
              <td>{resumen.numeroCuotasPactadas}</td>
            </tr>
            <tr>
              <th>Nro. cuotas pagadas: </th>
              <td>{resumen.numeroCuotasPagadas}</td>
            </tr>
            <tr>
              <th>Monto total pagado: </th>
              <td>${resumen.montoTotalPagado}</td>
            </tr>
            <tr>
              <th>Fecha último pago: </th>
              <td>{resumen.fechaUltimoPago === null 
              ? "-"
              : resumen.fechaUltimoPago != null
              ? formatDate(resumen.fechaUltimoPago)
              : "No hay últuma fecha de pago"}</td>
            </tr>
            <tr>
              <th>Saldo por pagar: </th>
              <td>${resumen.saldoPorPagar}</td>
            </tr>
            <tr>
              <th>Nro. Cuotas con retraso: </th>
              <td>{resumen.numeroCuotasConRetraso}</td>
            </tr>
          </table>
        </div>
      </Styles>
    </div>
  );
}

export default VerResumenComponent;

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

  .f {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column; /* Añade dirección de columna para centrar verticalmente */
  }

  .content-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    min-width: 400px;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  .content-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    font-weight: bold;
  }

  .content-table th,
  .content-table td {
    padding: 12px 15px;
  }

  .content-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .content-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  .content-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  .content-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`
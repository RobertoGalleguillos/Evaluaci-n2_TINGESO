import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NavbarComponent from "./Navbar2Component";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import CuotaService from "../services/CuotaService";
import swal from 'sweetalert';

function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function VerCuotasComponent() {
    const { rut } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [selectedCuota, setSelectedCuota] = useState(null);
  

  useEffect(() => {
    fetch("http://localhost:8080/cuota/rut/" + rut)
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      setCuotas(data);
    } else {
      setCuotas([]);
    }
  });
  }, []);

  const handleSelectCuota = (cuota) => {
  CuotaService.PagarCuota(cuota.id)
    .then((paymentResult) => {
      if (paymentResult.data === 'Cuota pagada') {
        setSelectedCuota(cuota);
        swal({
          title: 'Pago Exitoso',
          text: 'El pago se ha realizado con éxito.',
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
      } else {
        swal({
          title: 'No se pudo realizar el pago de la cuota',
          text: 'No se cumple con la fecha permitida para pagar la cuota, por favor vuelva a intentarlo entre los días 5 a 10 de cada mes.',
          icon: 'warning',
        }).then(() => {
        });
      }
    })
    .catch((error) => {
      console.error('Error al procesar el pago:', error);
      swal({
        title: 'Error',
        text: 'Hubo un error al procesar el pago',
        icon: 'error',
      });
    });
};

  return (
    <div className="home">
      <NavbarComponent />
      <Styles>
        <h1 className="text-center">
          <b>Cuotas</b>
        </h1>
        <div className="f">
          <table border="1" className="content-table">
            <thead>
              <tr>
                <th>Rut</th>
                <th>Monto</th>
                <th>Fecha vencimiento</th>
                <th>Descuento</th>
                <th>Interés</th>
                <th>Estado</th>
                <th>Fecha de pago</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id}>
                  <td>{cuota.rut}</td>
                  <td>${cuota.montoCuota}</td>
                  <td>{formatDate(cuota.fechaVencimiento)}</td>
                  <td>{cuota.descuento}</td>
                  <td>{cuota.interes}</td>
                  <td>
                        {cuota.pagado === true
                            ? "Pagado"
                            : cuota.pagado === false
                            ? "Por pagar"
                            : "Aún no se ha pagado la cuota"}
                  </td>
                  <td>
                        {cuota.pagado === true
                            ? formatDate(cuota.fechaPago)
                            : cuota.pagado === false
                            ? "-"
                            : "Aún no se ha pagado la cuota"}
                  </td>
                  <td>
                    {cuota.pagado ? (
                        <Button className="boton" disabled>
                            Pagado
                        </Button>
                        ) : (
                        <Button className="boton" onClick={() => handleSelectCuota(cuota)}>
                            Pagar
                        </Button>
                        )}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </Styles>
    </div>
  );
}

export default VerCuotasComponent;

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
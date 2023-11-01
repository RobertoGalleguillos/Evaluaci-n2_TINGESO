import React, { Component } from "react";
import NavbarComponent from "./NavbarComponent";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import CuotaService from "../services/CuotaService";

function formatDate(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

class EscogerEstudianteCuotaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estudiantes: [],
      selectedEstudiante: null,
      selectedPayment: null,
      cuotasGeneradas: false,
      cuotasSeleccionadas: 2,
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/estudiante")
      .then((response) => response.json())
      .then((data) => this.setState({ estudiantes: data }));
  }

  handleSelectEstudiante = (estudiante) => {
    this.setState({ selectedEstudiante: estudiante, selectedPayment: null, cuotasGeneradas: false });

    CuotaService.GenerarCuota(estudiante.id)
    .then((response) => {
      if (response.data && response.data.existenCuotas) {
        swal({
          title: "Cuotas generadas",
          text: "Ya se generaron cuotas para este estudiante",
          icon: "warning",
          buttons: ["Aceptar"],
          dangerMode: false
        });
        this.setState({ cuotasGeneradas: true });
      } else {
        const { descuento, cantidadMaxCuotas } = response.data;
        this.setState({ descuento, cantidadMaxCuotas });
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos de la cuota: ", error);
    });
  }

  handlePaymentSelection = (paymentType) => {
    if (this.state.cuotasGeneradas) {
      return;
    }

    this.setState({ selectedPayment: paymentType });

    if (paymentType === "Pago en cuotas") {
      swal({
        title: `Pago en cuotas`,
        text: `Monto arancel con descuento: $${this.state.descuento}\nCantidad máxima de cuotas: ${this.state.cantidadMaxCuotas}\nMonto matrícula: $70000`,
        content: {
          element: "input",
          attributes: {
            type: "number",
            min: 2, 
            max: this.state.cantidadMaxCuotas, 
            value: this.state.cuotasSeleccionadas,
          },
        },
        icon: "warning",
        buttons: ["Cancelar", "Generar"],
        dangerMode: false,
      }).then((value) => {
        if (value !== null) {
          const cuotasSeleccionadas = parseInt(value, 10);
        this.setState({ cuotasSeleccionadas }, () => {
          this.guardarCuotas();
        }); 
        }
      });
    } else if (paymentType === "Pago al contado") {
      swal({
        title: `Pago al contado`,
        text: `Monto arancel sin descuento: $750000\nMonto matrícula: $70000`,
        icon: "warning",
        buttons: ["Cancelar", "Generar"],
        dangerMode: false,
      }).then((value) => {
        if (value !== null) {
          this.guardarPagoAlContado(); 
        }
      });
    }
  }

  guardarCuotas = () => {
    CuotaService.GuardarCuotas(this.state.selectedEstudiante.rut, this.state.cuotasSeleccionadas, this.state.descuento)
      .then(() => {
        swal("Cuotas generadas con éxito", "Se han generado las cuotas correctamente.", "success");
      })
      .catch((error) => {
        console.error("Error al generar las cuotas: ", error);
      });
  };

  guardarPagoAlContado = () => {
    CuotaService.GuardarPagoAlContado(this.state.selectedEstudiante.rut)
      .then(() => {
        swal("Pago al contado generado con éxito", "Se ha generado el pago al contado correctamente.", "success");
      })
      .catch((error) => {
        console.error("Error al generar el pago al contado: ", error);
      });
  };

  render() {
    return (
      <div className="home">
        <NavbarComponent />
        <Styles>
          <h1 className="text-center">
            <b>Selección de estudiante para generar cuota</b>
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
                {this.state.estudiantes.map((estudiante) => (
                  <tr key={estudiante.rut}>
                    <td>{estudiante.rut}</td>
                    <td>{estudiante.nombres}</td>
                    <td>{estudiante.apellidos}</td>
                    <td>{formatDate(estudiante.fechaNacimiento)}</td>
                    <td>{estudiante.nombreColegio}</td>
                    <td>{estudiante.tipoColegioProcedencia}</td>
                    <td>{estudiante.anioEgreso}</td>
                    <td>
                      <Button className="boton" onClick={() => this.handleSelectEstudiante(estudiante)}>Seleccionar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {this.state.selectedEstudiante && (
            <div className="payment-panel">
              <p>Seleccione el tipo de pago para {this.state.selectedEstudiante.nombres}:</p>
              <Button className="boton" onClick={() => this.handlePaymentSelection("Pago en cuotas")} disabled={this.state.cuotasGeneradas}>Pago en cuotas</Button>
              <Button className="boton" onClick={() => this.handlePaymentSelection("Pago al contado")} disabled={this.state.cuotasGeneradas}>Pago al contado</Button>
            </div>
          )}
        </Styles>
      </div>
    );
  }
}

export default EscogerEstudianteCuotaComponent;

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
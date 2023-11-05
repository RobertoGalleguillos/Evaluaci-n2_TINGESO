import React, { Component } from "react";
import NavbarComponent2 from "./NavbarComponent";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import SubirNotasService from "../services/SubirNotasService";

function formatDate(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

class VerNotasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.handleSelectEliminar = this.handleSelectEliminar.bind(this);
        this.handleSelectCalcular = this.handleSelectCalcular.bind(this);
    }

    handleSelectEliminar = () => {
        swal({
            title: "¿Está seguro de que desea eliminar las notas seleccionadas?",
            text: "Tenga en cuenta que las notas se eliminarán de la Base de Datos.",
            icon: "warning",
            buttons: ["Cancelar", "Eliminar"],
            dangerMode: true
        }).then(respuesta=>{
            if(respuesta){
                swal("Notas eliminadas correctamente!", {icon: "success", timer: "3000"});
                SubirNotasService.EliminarData().then((res) => {
                });
                setTimeout(function(){ window.location.reload(); }, 1100);
            }
            else{
                swal({text: "Notas no eliminadas.", icon: "error"});
            }
        });
    };

    handleSelectCalcular = () => {
        swal({
            title: "¿Está seguro de que desea calcular la planilla?",
            text: "Tenga en cuenta que la planilla se calculará y no se podrán revertir los cambios.",
            icon: "warning",
            buttons: ["Cancelar", "Calcular"],
            dangerMode: true
        }).then(respuesta=>{
            SubirNotasService.CalcularDescuentos().then(res => {
                if(res.data === 'Descuentos calculados con exito'){
                    swal("Planilla calculada correctamente!", {icon: "success", timer: "3000"});
                    setTimeout(function(){ window.location.reload(); }, 1100);
                }
                else{
                    swal({text: "No se puede calcular la planilla en esta fecha, vuelva a intentarlo en otro día que no sea del 5 al 10 de cada mes.", icon: "error"});
                }
            })
        });
    };
        

    componentDidMount() {
        fetch("http://localhost:8080/subirNotas/notas")
            .then((response) => response.json())
            .then((data) => this.setState({ data: data }));
    }

    render() {
        return (
            <div className="home">
                <NavbarComponent2 />
                <Styles>
                    <h1 className="text-center"> <b>Notas</b></h1>
                    <div className="f">
                        <table border="1" class="content-table">
                            <thead>
                                <tr>
                                    <th>Rut</th>
                                    <th>Fecha examen</th>
                                    <th>Puntaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map((data) => (
                                    <tr key={data.id}>
                                        <td>{data.rut}</td>
                                        <td>{formatDate(data.fechaExamen)}</td>
                                        <td>{data.puntaje}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <Button className="boton cargar-button" onClick={this.handleSelectCalcular}>Calcular planilla</Button>
                        <span style={{ margin: "10px" }}></span> {}
                        <Button className="boton eliminar-button" onClick={this.handleSelectEliminar}>Eliminar</Button>
                    </div>
                </Styles>
            </div>
        );
    }
}

export default VerNotasComponent;

const Styles = styled.div`
    .text-center {
        text-align: center;
        justify-content: center;
        padding-top: 8px;
    }

    .f {
        justify-content: center;
        align-items: center;
        display: flex;
    }

    * {
        font-family: sans-serif;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
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

    .content-table th, .content-table td {
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

    .cargar-button {
        background-color: #009879;
        border: none;
        width: auto;
    }

    .eliminar-button {
        background-color: red;
        border: none;
        width: auto;
    }
`;

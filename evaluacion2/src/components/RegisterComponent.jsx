import React, { useState } from "react";
import NavbarComponent from "./NavbarComponent";
import moment from 'moment';
import styled from "styled-components";
import EstudianteService from "../services/EstudianteService";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';

export default function RegisterComponent(props){

    const initialState = {
        rut: "",
        apellidos: "",
        nombres: "",
        tipoColegioProcedencia: "",
        nombreColegio: "",
        anioEgreso: "",
        fecha: ""
    };

    const [input, setInput] = useState(initialState);
    
    const changeRutHandler = event => {
        setInput({ ...input, rut: event.target.value });
        console.log(input.rut);
    };
    const changeApellidosHandler = event => {
        setInput({ ...input, apellidos: event.target.value });
        console.log(input.apellidos);
    };
    const changeNombresHandler = event => {
        setInput({ ...input, nombres: event.target.value });
        console.log(input.nombres);
    };
    const changeTipoColegioHandler = event => {
        setInput({ ...input, tipoColegioProcedencia: event.target.value });
        console.log(input.tipoColegioProcedencia);
    };
    const changeNombreColegioHandler = event => {
        setInput({ ...input, nombreColegio: event.target.value });
        console.log(input.nombreColegio);
    };
    const changeAnioEgresoHandler = event => {
        setInput({ ...input, anioEgreso: event.target.value });
        console.log(input.anioEgreso);
    };
    const changeFechaHandler = event => {
        const selectedDate = moment(event.target.value).add(1, 'days').format('YYYY-MM-DD');
        setInput({ ...input, fechaNacimiento: selectedDate });
        console.log(input.fechaNacimiento);
    };

    
    const registrarEstudiante = e => {
        e.preventDefault();
        swal({
            title: "¿Está seguro de que desea registrar el estudiante?",
            icon: "warning",
            buttons: ["Cancelar", "Enviar"],
            dangerMode: true
        }).then(respuesta=>{
            if(respuesta){
                swal("Estudiante registrado correctamente!", {icon: "success", timer: "3000"});
                let estudiante = { rut: input.rut, apellidos: input.apellidos, nombres: input.nombres, tipoColegioProcedencia: input.tipoColegioProcedencia, nombreColegio: input.nombreColegio, anioEgreso: input.anioEgreso, fechaNacimiento: input.fechaNacimiento};
                console.log(input.rut)
                console.log(input.apellidos)
                console.log(input.nombres)
                console.log(input.tipoColegioProcedencia)
                console.log(input.nombreColegio)
                console.log(input.anioEgreso)
                console.log(input.fechaNacimiento)
                console.log("estudiante => " + JSON.stringify(estudiante));
                EstudianteService.RegistrarEstudiante(estudiante).then(
                    (res) => {
                    }
                  );
                }
            else{
                swal({text: "Estudiante no registrado.", icon: "error"});
            }
        });
    };

    return(
            
            <Styles>
            <div className="home">
                <NavbarComponent />
                    <div className="mainclass">
                        <div className="form1">
                            <h1 className="text-center"><b>Registrar estudiante</b></h1>
                            <div className="formcontainer">
                                <hr></hr>
                                <div className="container">
                                    <Form>
                                        <Form.Group className="mb-3" controlId="rut" value = {input.rut} onChange={changeRutHandler}>
                                            <Form.Label>Rut del estudiante</Form.Label>
                                            <Form.Control type="rut" placeholder="Rut del estudiante en formato xx.xxx.xxx-x" required/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="apellidos" value = {input.apellidos} onChange={changeApellidosHandler}>
                                            <Form.Label>Apellidos del estudiante</Form.Label>
                                            <Form.Control type="text" placeholder="Digite apellidos del estudiante" required/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="nombres" value = {input.nombres} onChange={changeNombresHandler}>
                                            <Form.Label>Nombres del estudiante</Form.Label>
                                            <Form.Control type="text" placeholder="Digite los nombres del estudiante" required/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="tipoColegioProcedencia" value = {input.tipoColegioProcedencia} onChange={changeTipoColegioHandler}>
                                            <Form.Label>Tipo de colegio de procedencia del estudiante</Form.Label>
                                            <br></br>
                                            <Form.Select required>
                                                <option value="">Seleccione el tipo de colegio</option>
                                                <option value="Municipal">Municipal</option>
                                                <option value="Privado">Privado</option>
                                                <option value="Subvencionado">Subvencionado</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="nombreColegio" value = {input.nombreColegio} onChange={changeNombreColegioHandler}>
                                            <Form.Label>Nombre del colegio de procedencia del estudiante</Form.Label>
                                            <Form.Control type="text" placeholder="Digite el nombre del colegio" required/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="fechaNacimiento" value = {input.fechaNacimiento} onChange={changeFechaHandler}>
                                            <Form.Label>Fecha de nacimiento</Form.Label>
                                            <Form.Control type="date" required/>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="anioEgreso" value = {input.anioEgreso} onChange={changeAnioEgresoHandler}>
                                            <Form.Label>Año de egreso del estudiante</Form.Label>
                                            <Form.Control type="number" min="1970" max="2023" placeholder="Digite el año de egreso del estudiante" required/>
                                        </Form.Group>
                                    </Form>
                                </div>
                                <Button className="boton" onClick={registrarEstudiante}>Registrar estudiante</Button>
                            </div>
                        </div>
                    </div>
                
            </div>
            </Styles>
        )
    }


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

.home{
    background-color: #006992;
    margin: 0;
    padding: 0;
}

.mainclass{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    font-family: Roboto, Arial, sans-serif;
    font-size: 15px;
}

.form1{
    border: 9px solid #CED0CE;
    background-color: #DADDD8;
    width: 50%;
    padding: 36px;
}

input[type=rut], input[type=fecha] {
    width: 100%;
    padding: 16px 8px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

Button {
    background-color: #42bfbb;
    color: white;
    padding: 14px 0;
    margin: 10px 0;
    border: none;
    cursor: grabbing;
    width: 100%;
}

Button:hover {
    opacity: 0.8;
}

.formcontainer {
    text-align: left;
    margin: 24px 100px 9px;
}

.container {
    padding: 24px 0;
    text-align:left;
}

span.psw {
    float: right;
    padding-top: 0;
    padding-right: 15px;
}
`
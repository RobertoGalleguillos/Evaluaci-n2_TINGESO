package com.tingeso.subirnotasservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class EstudianteModel {
    private Long id;
    private String rut;
    private String apellidos;
    private String nombres;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fechaNacimiento;
    private String tipoColegioProcedencia;
    private String nombreColegio;
    private int anioEgreso;
    private int cantidadExamenes;
    private int sumaPuntajes;
}

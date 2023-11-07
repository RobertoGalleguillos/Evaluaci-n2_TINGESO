package com.tingeso.subirnotasservice.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class CuotaModel {
    private Long id;
    private String rut;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fechaVencimiento;
    private boolean pagado;
    private double descuento;
    private double interes;
    private int montoCuota;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fechaPago;
}

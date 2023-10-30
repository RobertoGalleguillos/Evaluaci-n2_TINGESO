package com.tingeso.subirnotasservice.entities;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;


@Entity
@Table(name = "data")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SubirNotasEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String rut;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fechaExamen;
    private int puntaje;
    private String nombreArchivo;

}

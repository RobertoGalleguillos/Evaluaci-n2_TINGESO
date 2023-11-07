package com.tingeso.subirnotasservice.controllers;

import com.tingeso.subirnotasservice.entities.SubirNotasEntity;
import com.tingeso.subirnotasservice.services.SubirNotasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;

@RestController
@RequestMapping("/subirNotas")
public class SubirNotasController {

    @Autowired
    SubirNotasService subirNotasService;

    @PostMapping
    public ResponseEntity<?> subirNotas(@RequestParam("file")MultipartFile file){
        subirNotasService.guardar(file);
        subirNotasService.leerCsv(file.getOriginalFilename());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notas")
    public ResponseEntity<?> obtenerNotas(){
        return ResponseEntity.ok(subirNotasService.obtenerData());
    }

    @PostMapping("/eliminar")
    public ResponseEntity<?> eliminarNotas(){
        ArrayList<SubirNotasEntity> notas = subirNotasService.obtenerData();
        subirNotasService.eliminarData(notas);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/calcularDescuentos")
    public ResponseEntity<?> calcularDescuentos(){
        if(subirNotasService.fechaAceptadaParaCalcularPlantilla(new Date())){
            subirNotasService.procesarNotasConDescuento();
            subirNotasService.revisarIntereses();
            ArrayList<SubirNotasEntity> notas = subirNotasService.obtenerData();
            subirNotasService.eliminarData(notas);
            return ResponseEntity.ok("Descuentos calculados con exito");
        }
        else{
            return ResponseEntity.ok("No se puede calcular descuentos en esta fecha");
        }
    }
}

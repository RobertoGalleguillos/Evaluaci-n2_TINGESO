package com.tingeso.estudianteservice.controllers;

import com.tingeso.estudianteservice.entities.EstudianteEntity;
import com.tingeso.estudianteservice.services.EstudianteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/estudiante")
public class EstudianteController {

    @Autowired
    EstudianteService estudianteService;

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteEntity> obtenerEstudiantePorId(@PathVariable Long id) {
        Optional<EstudianteEntity> estudiante = estudianteService.obtenerPorId(id);
        return estudiante.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/rut/{rut}")
    public ResponseEntity<EstudianteEntity> obtenerEstudiantePorRut(@PathVariable String rut) {
        EstudianteEntity estudiante = estudianteService.obtenerPorRut(rut);
        if(estudiante == null){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(estudiante);
    }

    @GetMapping
    public ResponseEntity<List<EstudianteEntity>> obtenerEstudiantes() {
        List<EstudianteEntity> estudiantes = estudianteService.obtenerEstudiantes();
        if(estudiantes.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(estudiantes);
    }

    @PostMapping
    public void guardarEstudiante(@RequestBody EstudianteEntity estudiante) {
        estudianteService.guardarEstudiante(estudiante);
    }

    @GetMapping("/eliminar/{id}")
    public void eliminarEstudiante(@PathVariable Long id) {
        estudianteService.eliminarEstudiante(id);
    }

    @GetMapping("/resumen/{id}")
    public ResponseEntity<?> obtenerResumenEstudiante(@PathVariable Long id) {
        Optional<EstudianteEntity> estudianteOptional = estudianteService.obtenerPorId(id);
        if(estudianteOptional.isPresent()){
            EstudianteEntity estudiante = estudianteOptional.get();
            int promedioExamenesTotales = estudianteService.calcularPromedioTotalExamenes(estudiante);
            int montoTotalArancelPagar = estudianteService.montoTotalArancelPagar(estudiante);
            String tipoPago = estudianteService.tipoPago(estudiante);
            int numeroCuotasPactadas = estudianteService.numeroCuotasPactadas(estudiante);
            int numeroCuotasPagadas = estudianteService.numeroCuotasPagadas(estudiante);
            int montoTotalPagado = estudianteService.montoTotalPagado(estudiante);
            Date fechaUltimoPago = estudianteService.fechaUltimoPago(estudiante);
            int saldoPorPagar = estudianteService.saldoPorPagar(estudiante);
            int numeroCuotasConRetraso = estudianteService.numeroCuotasConRetraso(estudiante);
            Map<String, Object> response = new HashMap<>();
            response.put("numeroCuotasConRetraso", numeroCuotasConRetraso);
            response.put("saldoPorPagar", saldoPorPagar);
            response.put("fechaUltimoPago", fechaUltimoPago);
            response.put("montoTotalPagado", montoTotalPagado);
            response.put("numeroCuotasPagadas", numeroCuotasPagadas);
            response.put("numeroCuotasPactadas", numeroCuotasPactadas);
            response.put("tipoPago", tipoPago);
            response.put("montoTotalArancelPagar", montoTotalArancelPagar);
            response.put("promedioExamenesTotales", promedioExamenesTotales);
            response.put("estudiante", estudiante);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.noContent().build();
    }

}

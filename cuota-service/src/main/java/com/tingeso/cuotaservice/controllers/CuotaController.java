package com.tingeso.cuotaservice.controllers;

import com.tingeso.cuotaservice.entities.CuotaEntity;
import com.tingeso.cuotaservice.models.EstudianteModel;
import com.tingeso.cuotaservice.services.CuotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/cuota")
public class CuotaController {
    @Autowired
    CuotaService cuotaService;


    @PostMapping
    public void guardarCuota(@RequestBody CuotaEntity cuota) {
        cuotaService.guardarCuota(cuota);
    }

    @GetMapping
    public ResponseEntity<List<CuotaEntity>> obtenerCuotas() {
        List<CuotaEntity> cuotas = cuotaService.obtenerCuotas();
        if(cuotas.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cuotas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<CuotaEntity>> obtenerCuotasPorId(@PathVariable Long id) {
        List<CuotaEntity> cuotas = cuotaService.obtenerCuotasPorIdEstudiante(id);
        if(cuotas.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cuotas);
    }

    @GetMapping("/rut/{rut}")
    public ResponseEntity<List<CuotaEntity>> obtenerCuotasPorRut(@PathVariable String rut) {
        List<CuotaEntity> cuotas = cuotaService.obtenerCuotasPorRut(rut);
        if(cuotas.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cuotas);
    }

    @GetMapping("/estudiantes")
    public ResponseEntity<List<EstudianteModel>> obtenerEstudiantes() {
        List<EstudianteModel> estudiantes = cuotaService.obtenerEstudiantesConCuotas();
        if(estudiantes.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(estudiantes);
    }

    @GetMapping("/eliminar/{id}")
    public void eliminarCuotasEstudiante(@PathVariable Long id) {
        cuotaService.eliminarCuotasPorIdEstudiante(id);
    }

    @GetMapping("/generar_cuota/{id}")
    public ResponseEntity<?> agregar(@PathVariable Long id){
        EstudianteModel estudiante = cuotaService.obtenerEstudiantePorId(id);
        if(estudiante == null){
            return ResponseEntity.noContent().build();
        }
        if(cuotaService.existeCuota(estudiante.getRut())){
            Map<String, Object> response = new HashMap<>();
            response.put("existenCuotas", true);
            return ResponseEntity.ok(response);
        }
        int descuento = cuotaService.descuentoMontoCuotas(estudiante);
        int cantidadMaxCuotas = cuotaService.cantidadMaxCuotas(estudiante);
        Map<String, Object> response = new HashMap<>();
        response.put("descuento", descuento);
        response.put("cantidadMaxCuotas", cantidadMaxCuotas);
        response.put("estudiante", estudiante);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/guardar_cuotas")
    public void guardarCuotas(@RequestParam("rut") String rut,
                              @RequestParam("cantidadCuotasSeleccionadas") int cantidadCuotas,
                              @RequestParam("montoTotal") int montoTotal) {

        cuotaService.generarCuotas(cantidadCuotas, montoTotal, rut);
    }

    @PostMapping("/guardar_pago_al_contado")
    public void guardarPagoAlContado(@RequestParam("rut") String rut) {
        cuotaService.generarPagoAlContado(rut);
    }

    @GetMapping("/pagar_al_contado/{id}")
    public ResponseEntity<?> pagarAlContado(@PathVariable Long id){
        EstudianteModel estudiante = cuotaService.obtenerEstudiantePorId(id);
        if(estudiante == null){
            return ResponseEntity.noContent().build();
        }
        if(cuotaService.existeCuota(estudiante.getRut())){
            return ResponseEntity.ok("Ya se generaron cuotas para este estudiante");
        }
        return ResponseEntity.ok(estudiante);
    }

    @GetMapping ("/pagar_cuota/{id}")
    public ResponseEntity<?> pagarCuota(@PathVariable Long id){
        Optional<CuotaEntity> cuota = cuotaService.obtenerPorId(id);
        if(cuota.isPresent()){
            if(cuotaService.fechaAceptadaParaPago(new Date())){
                cuotaService.pagarCuota(cuota.get());
                return ResponseEntity.ok("Cuota pagada");
            }
            else{
                return ResponseEntity.ok("No se cumple la fecha para pagar la cuota");
            }
        }
        else{
            return ResponseEntity.noContent().build();
        }
    }


}

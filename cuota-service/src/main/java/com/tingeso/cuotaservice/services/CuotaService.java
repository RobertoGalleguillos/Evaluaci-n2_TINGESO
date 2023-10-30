package com.tingeso.cuotaservice.services;

import com.tingeso.cuotaservice.entities.CuotaEntity;
import com.tingeso.cuotaservice.models.EstudianteModel;
import com.tingeso.cuotaservice.repositories.CuotaRepository;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.time.LocalDate;
@Service
public class CuotaService {
    @Autowired
    CuotaRepository cuotaRepository;

    @Autowired
    RestTemplate restTemplate;

    public ArrayList<CuotaEntity> obtenerCuotas() {
        return (ArrayList<CuotaEntity>) cuotaRepository.findAll();
    }

    public void guardarCuota(CuotaEntity cuota) {
        cuotaRepository.save(cuota);
    }

    public Optional<CuotaEntity> obtenerPorId(Long id) {
        return cuotaRepository.findById(id);
    }

    public ArrayList<CuotaEntity> obtenerCuotasPorRut(String rut){
        return cuotaRepository.findAllByRut(rut);
    }
    @Transactional
    public void eliminarCuotasPorRut(String rut){
        cuotaRepository.deleteAllByRut(rut);
    }

    public void eliminarCuota(Long id){
        cuotaRepository.deleteById(id);
    }

    public int descuentoMontoCuotas(EstudianteModel estudiante){
        int montoTotal = 1500000;
        int montoOriginal = 1500000;
        int year_actual = LocalDate.now().getYear();
        if(Objects.equals(estudiante.getTipoColegioProcedencia(), "Municipal")){
            montoTotal = montoTotal - (montoOriginal*20/100);
        }
        if(Objects.equals(estudiante.getTipoColegioProcedencia(), "Subvencionado")){
            montoTotal = montoTotal - (montoOriginal*10/100);
        }
        if(year_actual - estudiante.getAnioEgreso()==0){
            montoTotal = montoTotal - (montoOriginal*15/100);
        }
        if((year_actual - estudiante.getAnioEgreso()==1) || (year_actual - estudiante.getAnioEgreso()==2)){
            montoTotal = montoTotal - (montoOriginal*8/100);
        }
        if((year_actual - estudiante.getAnioEgreso()==3) || (year_actual - estudiante.getAnioEgreso()==4)){
            montoTotal = montoTotal - (montoOriginal*4/100);
        }
        return montoTotal;
    }

    public int cantidadMaxCuotas(EstudianteModel estudiante){
        int cantidadMaxCuotas = 0;
        if(Objects.equals(estudiante.getTipoColegioProcedencia(), "Municipal")){
            cantidadMaxCuotas = 10;
        }
        if(Objects.equals(estudiante.getTipoColegioProcedencia(), "Subvencionado")){
            cantidadMaxCuotas = 7;
        }
        if(Objects.equals(estudiante.getTipoColegioProcedencia(), "Privado")){
            cantidadMaxCuotas = 4;
        }
        return cantidadMaxCuotas;
    }

    public void generarCuotas(int cantidadCuotasSeleccionada, int montoTotal, String rut){
        int montoCuota = montoTotal / cantidadCuotasSeleccionada;
        Date fechaVencimiento = new Date();
        for(int i = 0; i < cantidadCuotasSeleccionada; i++){
            CuotaEntity cuota = new CuotaEntity();
            if(i==0){
                fechaVencimiento = sumarMesesAFecha(fechaVencimiento, 1);
                fechaVencimiento.setDate(10);
                cuota.setRut(rut);
                cuota.setFechaVencimiento(fechaVencimiento);
                cuota.setPagado(false);
                cuota.setDescuento(0);
                cuota.setInteres(0);
                cuota.setMontoCuota(montoCuota+70000);
            }
            else{
                fechaVencimiento = sumarMesesAFecha(fechaVencimiento, 1);
                cuota.setRut(rut);
                cuota.setFechaVencimiento(fechaVencimiento);
                cuota.setPagado(false);
                cuota.setDescuento(0);
                cuota.setInteres(0);
                cuota.setMontoCuota(montoCuota);
            }
            cuotaRepository.save(cuota);
        }
    }

    private Date sumarMesesAFecha(Date fecha, int meses) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fecha);
        calendar.add(Calendar.MONTH, meses);
        return calendar.getTime();
    }

    public boolean existeCuota(String rut) {
        Long count = cuotaRepository.countByRut(rut);
        return count > 0;
    }

    public void generarPagoAlContado(String rut){
        CuotaEntity cuota = new CuotaEntity();
        cuota.setRut(rut);
        cuota.setFechaVencimiento(new Date());
        cuota.setPagado(true);
        cuota.setDescuento(0);
        cuota.setInteres(0);
        cuota.setMontoCuota(750000+70000);
        cuota.setFechaPago(new Date());
        cuotaRepository.save(cuota);
    }



    public void pagarCuota(CuotaEntity cuota){
        cuota.setPagado(true);
        cuota.setFechaPago(new Date());
        cuotaRepository.save(cuota);
    }






    public boolean fechaAceptadaParaPago(Date fechaActual) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fechaActual);
        int diaDelMes = calendar.get(Calendar.DAY_OF_MONTH);
        return diaDelMes >= 5 && diaDelMes <= 10;
    }

    public List<CuotaEntity> obtenerCuotasPorIdEstudiante(Long idEstudiante){
        EstudianteModel estudiante = restTemplate.getForObject("http://estudiante-service/estudiante/"+idEstudiante, EstudianteModel.class);
        if(estudiante==null){
            return null;
        }
        List<CuotaEntity> cuotas = obtenerCuotasPorRut(estudiante.getRut());
        return cuotas;
    }

    public List<EstudianteModel> obtenerEstudiantesConCuotas() {
        ResponseEntity<List<EstudianteModel>> response = restTemplate.exchange(
                "http://estudiante-service/estudiante",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EstudianteModel>>() {}
        );

        List<EstudianteModel> estudiantes = response.getBody();

        List<EstudianteModel> estudiantesConCuotas = new ArrayList<>();
        for (EstudianteModel estudiante : estudiantes) {
            if (existeCuota(estudiante.getRut())) {
                estudiantesConCuotas.add(estudiante);
            }
        }
        return estudiantesConCuotas;
    }

    @Transactional
    public void eliminarCuotasPorIdEstudiante(Long idEstudiante){
        EstudianteModel estudiante = restTemplate.getForObject("http://estudiante-service/estudiante/"+idEstudiante, EstudianteModel.class);
        if(estudiante==null){
            return;
        }
        eliminarCuotasPorRut(estudiante.getRut());
    }

    public EstudianteModel obtenerEstudiantePorId(Long idEstudiante){
        EstudianteModel estudiante = restTemplate.getForObject("http://estudiante-service/estudiante/"+idEstudiante, EstudianteModel.class);
        return estudiante;
    }






}

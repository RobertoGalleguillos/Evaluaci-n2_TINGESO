package com.tingeso.estudianteservice.services;

import com.tingeso.estudianteservice.entities.EstudianteEntity;
import com.tingeso.estudianteservice.models.CuotaModel;
import com.tingeso.estudianteservice.repositories.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EstudianteService {
    @Autowired
    EstudianteRepository estudianteRepository;

    @Autowired
    RestTemplate restTemplate;


    public ArrayList<EstudianteEntity> obtenerEstudiantes() {
        return (ArrayList<EstudianteEntity>) estudianteRepository.findAll();
    }

    public EstudianteEntity guardarEstudiante(EstudianteEntity estudiante) {
        return estudianteRepository.save(estudiante);
    }

    public Optional<EstudianteEntity> obtenerPorId(Long id) {
        return estudianteRepository.findById(id);
    }

    public EstudianteEntity obtenerPorRut(String rut) {
        return estudianteRepository.findByRut(rut);
    }


    public void eliminarEstudiante(Long id) {
        estudianteRepository.deleteById(id);
    }

    public int calcularPromedioTotalExamenes(EstudianteEntity estudiante) {
        if (estudiante.getCantidadExamenes() == 0) {
            return 0;
        } else {
            return estudiante.getSumaPuntajes() / estudiante.getCantidadExamenes();
        }
    }

    public int montoTotalArancelPagar(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        int montoTotalArancel = 0;
        for(CuotaModel cuota : cuotas){
            montoTotalArancel = montoTotalArancel + cuota.getMontoCuota();
        }
        montoTotalArancel -= 70000;
        return montoTotalArancel;
    }
    public String tipoPago(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        int cantidadCuotas = cuotas.size();
        if(cantidadCuotas == 1){
            return "Contado";
        }
        else{
            return "Cuotas";
        }
    }

    public int numeroCuotasPactadas(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        int cantidadCuotasPactadas = cuotas.size();
        return cantidadCuotasPactadas;
    }

    public int numeroCuotasPagadas(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        int cantidadCuotasPagadas = 0;
        for(CuotaModel cuota : cuotas){
            if(cuota.isPagado()){
                cantidadCuotasPagadas++;
            }
        }
        return cantidadCuotasPagadas;
    }

    public int montoTotalPagado(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        int montoTotalPagado = 0;
        for(CuotaModel cuota : cuotas){
            if(cuota.isPagado()){
                montoTotalPagado = montoTotalPagado + cuota.getMontoCuota();
            }
        }
        return montoTotalPagado;
    }

    public Date fechaUltimoPago(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        Date fechaUltimoPago = null;
        for(CuotaModel cuota : cuotas){
            if(cuota.isPagado()){
                fechaUltimoPago = cuota.getFechaPago();
            }
        }
        return fechaUltimoPago;
    }

    public int saldoPorPagar(EstudianteEntity estudiante){
        int saldoPorPagar = montoTotalArancelPagar(estudiante) + 70000 - montoTotalPagado(estudiante);
        return saldoPorPagar;
    }

    public int numeroCuotasConRetraso(EstudianteEntity estudiante){
        ResponseEntity<List<CuotaModel>> response = restTemplate.exchange(
                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>(){});
        List<CuotaModel> cuotas = response.getBody();
        int cantidadCuotasConRetraso = 0;
        for(CuotaModel cuota : cuotas){
            if(cuota.getInteres() > 0.0){
                cantidadCuotasConRetraso++;
            }
        }
        return cantidadCuotasConRetraso;
    }
}

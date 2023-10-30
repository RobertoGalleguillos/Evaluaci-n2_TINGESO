package com.tingeso.subirnotasservice.services;

import com.tingeso.subirnotasservice.entities.SubirNotasEntity;
import com.tingeso.subirnotasservice.models.CuotaModel;
import com.tingeso.subirnotasservice.models.EstudianteModel;
import com.tingeso.subirnotasservice.repositories.SubirNotasRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SubirNotasService {

    @Autowired
    private SubirNotasRepository dataRepository;

    @Autowired
    RestTemplate restTemplate;

    private final Logger logg = LoggerFactory.getLogger(SubirNotasService.class);

    public ArrayList<SubirNotasEntity> obtenerData(){
        return (ArrayList<SubirNotasEntity>) dataRepository.findAll();
    }

    public String guardar(MultipartFile file){
        String filename = file.getOriginalFilename();
        if(filename != null){
            if(!file.isEmpty()){
                try{
                    byte [] bytes = file.getBytes();
                    Path path  = Paths.get(file.getOriginalFilename());
                    Files.write(path, bytes);
                    logg.info("Archivo guardado");
                }
                catch (IOException e){
                    logg.error("ERROR", e);
                }
            }
            return "Archivo guardado con exito!";
        }
        else{
            return "No se pudo guardar el archivo";
        }
    }

    public void leerCsv(String direccion){
        String texto = "";
        BufferedReader bf = null;
        try{
            bf = new BufferedReader(new FileReader(direccion));
            String temp = "";
            String bfRead;
            int count = 1;
            String nombreArchivo = direccion;
            while((bfRead = bf.readLine()) != null){
                if (count == 1){
                    count = 0;
                }
                else{
                    SubirNotasEntity nota = guardarDataDB(bfRead.split(";")[0], bfRead.split(";")[1], bfRead.split(";")[2], nombreArchivo);
                    temp = temp + "\n" + bfRead;
                }
            }
            texto = temp;
            System.out.println("Archivo leido exitosamente");
        }catch(Exception e){
            System.err.println("No se encontro el archivo");
        }finally{
            if(bf != null){
                try{
                    bf.close();
                }catch(IOException e){
                    logg.error("ERROR", e);
                }
            }
        }
    }

    public void guardarData(SubirNotasEntity data){
        dataRepository.save(data);
    }


    public SubirNotasEntity guardarDataDB(String rut, String fechaExamen, String puntaje, String nombreArchivo){
        SubirNotasEntity newData = new SubirNotasEntity();
        newData.setRut(rut);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date fecha = dateFormat.parse(fechaExamen);
            newData.setFechaExamen(fecha);
        } catch (ParseException e) {
            logg.error("Error al convertir la fecha", e);
        }

        try {
            int puntajeInt = Integer.parseInt(puntaje);
            newData.setPuntaje(puntajeInt);
        } catch (NumberFormatException e) {
            logg.error("Error al convertir el puntaje", e);
        }
        newData.setNombreArchivo(nombreArchivo);
        guardarData(newData);
        return newData;
    }

    public void eliminarData(ArrayList<SubirNotasEntity> datas){
        dataRepository.deleteAll(datas);
    }

    public void descuentoCuotaPorNotas(int puntajePromedio, CuotaModel cuota) {
        double descuento = calcularDescuentoPorNotas(puntajePromedio);
        cuota.setDescuento(descuento);
        int montoCuota = cuota.getMontoCuota();
        int montoDescuento = (int) (montoCuota * descuento);
        int montoFinal = montoCuota - montoDescuento;
        cuota.setMontoCuota(montoFinal);
    }


    public double calcularDescuentoPorNotas(int puntajePromedio){
        double descuento = 0;
        if(puntajePromedio >= 850 && puntajePromedio <= 899){
            descuento = 0.02;
        }
        else if(puntajePromedio >= 900 && puntajePromedio <= 949){
            descuento = 0.05;
        }
        else if(puntajePromedio >= 950 && puntajePromedio <= 1000){
            descuento = 0.1;
        }

        return descuento;
    }


    public void procesarNotasConDescuento() {
        ResponseEntity<List<EstudianteModel>> response = restTemplate.exchange(
                "http://estudiante-service/estudiante",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<EstudianteModel>>() {}
        );

        List<EstudianteModel> estudiantes = response.getBody();
        ResponseEntity<List<CuotaModel>> responseCuotas = restTemplate.exchange(
                "http://cuota-service/cuota",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>() {}
        );
        List<CuotaModel> cuotas = responseCuotas.getBody();
        for(EstudianteModel estudiante : estudiantes){
            int promedio = calcularPromedioNotas(estudiante.getRut());
            Date fechaPrimerExamen = obtenerFechaPrimerExamen(estudiante.getRut());

            if (fechaPrimerExamen != null) {
                Calendar calExamen = Calendar.getInstance();
                calExamen.setTime(fechaPrimerExamen);
                int mesExamen = calExamen.get(Calendar.MONTH) + 1;
                int yearExamen = calExamen.get(Calendar.YEAR);

                for(CuotaModel cuota : cuotas){
                    if(estudiante.getRut().equals(cuota.getRut())){
                        ResponseEntity<List<CuotaModel>> response2 = restTemplate.exchange(
                                "http://cuota-service/cuota/rut/"+estudiante.getRut(),
                                HttpMethod.GET,
                                null,
                                new ParameterizedTypeReference<List<CuotaModel>>(){});
                        List<CuotaModel> cuotasRut = response2.getBody();
                        if(cuotasRut.size() == 1){
                            aplicarDescuentoPorNotasCasoContado(promedio, cuota);
                        }
                        else{
                            Calendar calVencimiento = Calendar.getInstance();
                            calVencimiento.setTime(cuota.getFechaVencimiento());
                            aplicarDescuentoPorNotasCasoCuotas(calVencimiento, mesExamen, yearExamen, cuota, promedio);
                        }
                    }
                }
            }
        }
    }

    public void aplicarDescuentoPorNotasCasoCuotas(Calendar calVencimiento, int mesExamen, int yearExamen, CuotaModel cuota, int promedio) {
        int mesVencimiento = calVencimiento.get(Calendar.MONTH) + 1;
        int yearVencimiento = calVencimiento.get(Calendar.YEAR);

        if ((((mesExamen < mesVencimiento) && (yearExamen == yearVencimiento)) || (yearExamen < yearVencimiento)) && !cuota.isPagado()) {
            descuentoCuotaPorNotas(promedio, cuota);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<CuotaModel> requestEntity = new HttpEntity<>(cuota, headers);
            restTemplate.postForEntity("http://cuota-service/cuota", requestEntity, Void.class);
        }
    }

    public void aplicarDescuentoPorNotasCasoContado(int promedio, CuotaModel cuota){
        descuentoCuotaPorNotas(promedio, cuota);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<CuotaModel> requestEntity = new HttpEntity<>(cuota, headers);
        restTemplate.postForEntity("http://cuota-service/cuota", requestEntity, Void.class);
    }

    public Date obtenerFechaPrimerExamen(String rut) {
        ArrayList<SubirNotasEntity> notas = dataRepository.findAllByRut(rut);
        if (!notas.isEmpty()) {
            notas.sort(Comparator.comparing(SubirNotasEntity::getFechaExamen));
            return notas.get(0).getFechaExamen();
        }
        return null;
    }

    public int calcularPromedioNotas(String rut) {
        ArrayList<SubirNotasEntity> notas = dataRepository.findAllByRut(rut);
        EstudianteModel estudiante = restTemplate.getForObject("http://estudiante-service/estudiante/rut/"+rut, EstudianteModel.class);
        int promedio = 0;
        for (SubirNotasEntity nota : notas) {
            int cantidadExamenes = estudiante.getCantidadExamenes();
            cantidadExamenes++;
            estudiante.setCantidadExamenes(cantidadExamenes);
            promedio += nota.getPuntaje();
        }
        int sumaPuntajes = estudiante.getSumaPuntajes();
        sumaPuntajes += promedio;
        estudiante.setSumaPuntajes(sumaPuntajes);
        promedio = promedio / 4;
        return promedio;
    }

    public boolean fechaAceptadaParaCalcularPlantilla(Date fechaActual) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(fechaActual);
        int diaDelMes = calendar.get(Calendar.DAY_OF_MONTH);
        return diaDelMes < 5 || diaDelMes > 10;
    }

    private int calcularDiferenciaMeses(Date fechaInicio, Date fechaFin) {
        Calendar calFechaInicio = Calendar.getInstance();
        Calendar calFechaFin = Calendar.getInstance();
        calFechaInicio.setTime(fechaInicio);
        calFechaFin.setTime(fechaFin);

        int years = calFechaFin.get(Calendar.YEAR) - calFechaInicio.get(Calendar.YEAR);
        int months = calFechaFin.get(Calendar.MONTH) - calFechaInicio.get(Calendar.MONTH);

        if(years < 0){
            months = 0;
            return months;
        }
        else if(years == 0){
            return months;
        }
        else if(years == 1){
            months = Math.abs((12-calFechaFin.get(Calendar.MONTH)) + (12-calFechaInicio.get(Calendar.MONTH)));
            return months;
        }
        else{
            months = Math.abs((12-calFechaFin.get(Calendar.MONTH)) + (12-calFechaInicio.get(Calendar.MONTH)));
            months = months + ((years-1)*12);
            return months;
        }
    }

    public double calcularInteres(CuotaModel cuota, Date fechaActual) {
        Date fechaVencimiento = cuota.getFechaVencimiento();

        int mesesDiferencia = calcularDiferenciaMeses(fechaVencimiento, fechaActual);

        double interes = 0.0;

        if ((mesesDiferencia == 1) && !cuota.isPagado()) {
            interes = 0.03;
        }
        else if ((mesesDiferencia == 2) && !cuota.isPagado()) {
            interes = 0.06;
        }
        else if ((mesesDiferencia == 3) && !cuota.isPagado()) {
            interes = 0.09;
        }
        else if ((mesesDiferencia > 3) && !cuota.isPagado()) {
            interes = 0.15;
        }

        return interes;
    }

    public void revisarIntereses(){
        ResponseEntity<List<CuotaModel>> responseCuotas = restTemplate.exchange(
                "http://cuota-service/cuota",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<CuotaModel>>() {}
        );
        List<CuotaModel> cuotas = responseCuotas.getBody();
        for(CuotaModel cuota : cuotas){
            if(!cuota.isPagado()){
                double interes = calcularInteres(cuota, new Date());
                if(interes > cuota.getInteres()){
                    cuota.setInteres(interes);
                    cuota.setMontoCuota(cuota.getMontoCuota() + (int) (cuota.getMontoCuota()*interes));
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    HttpEntity<CuotaModel> requestEntity = new HttpEntity<>(cuota, headers);
                    restTemplate.postForEntity("http://cuota-service/cuota", requestEntity, Void.class);
                }
            }
        }
    }


}

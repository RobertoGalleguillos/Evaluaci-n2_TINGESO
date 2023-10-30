package com.tingeso.cuotaservice.repositories;

import com.tingeso.cuotaservice.entities.CuotaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;


@Repository
public interface CuotaRepository extends JpaRepository<CuotaEntity, Long>{
    public CuotaEntity findByRut(String rut);

    Long countByRut(String rut);

    ArrayList<CuotaEntity> findAllByRut(String rut);

    void deleteAllByRut(String rut);
}

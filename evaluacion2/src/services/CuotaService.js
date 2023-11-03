import axios from "axios";

class CuotaService {
    
    GenerarCuota(id){
        return axios.get(`http://localhost:8080/cuota/generar_cuota/`+id);
    }
    GuardarCuotas(rut, cantidadCuotas, montoTotal) {
        return axios.post(`http://localhost:8080/cuota/guardar_cuotas`, null, {
          params: {
            rut: rut,
            cantidadCuotasSeleccionadas: cantidadCuotas,
            montoTotal: montoTotal
          }
        });
      }
    
      GuardarPagoAlContado(rut) {
        return axios.post(`http://localhost:8080/cuota/guardar_pago_al_contado`, null, {
          params: {
            rut: rut
          }
        });
      }

      PagarCuota(id){
        return axios.get(`http://localhost:8080/cuota/pagar_cuota/`+id)
      }
}

export default new CuotaService();
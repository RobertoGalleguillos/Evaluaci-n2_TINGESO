import axios from "axios";

class SubirNotasService{
    
    CargarArchivo(file){
        return axios.post("http://localhost:8080/subirNotas", file);
    }

    EliminarData(){
        return axios.post("http://localhost:8080/subirNotas/eliminar");
    }

    CalcularDescuentos(){
        return axios.post("http://localhost:8080/subirNotas/calcularDescuentos");
    }
}

export default new SubirNotasService()
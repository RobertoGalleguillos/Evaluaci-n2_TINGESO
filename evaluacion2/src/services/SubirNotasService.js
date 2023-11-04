import axios from "axios";

class SubirNotasService{
    
    CargarArchivo(file){
        return axios.post("http://localhost:8080/subirNotas", file);
    }
}

export default new SubirNotasService()
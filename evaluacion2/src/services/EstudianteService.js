import axios from "axios";

class EstudianteService {
    
    RegistrarEstudiante(estudiante){
        return axios.post(`http://localhost:8080/estudiante`, estudiante);
    }

    ResumenEstudiante(id){
        return axios.get(`http://localhost:8080/estudiante/resumen/`+id);
    }
}

export default new EstudianteService();
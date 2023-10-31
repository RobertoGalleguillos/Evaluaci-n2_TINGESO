import axios from "axios";

class EstudianteService {
    
    RegistrarEstudiante(estudiante){
        return axios.post(`http://localhost:8080/estudiante`, estudiante);
    }
}

export default new EstudianteService();
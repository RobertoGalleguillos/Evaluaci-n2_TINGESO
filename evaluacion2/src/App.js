import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeComponent from './components/HomeComponent';
import RegisterComponent from './components/RegisterComponent';
import EstudianteComponent from './components/EstudiantesComponent';
import EscogerEstudianteCuotaComponent from './components/EscogerEstudianteCuotaComponent';
import EstudiantesConCuotasComponent from './components/EstudiantesConCuotasComponent';
import VerCuotasComponent from './components/VerCuotasComponent';
import SubirNotasComponent from './components/SubirNotasComponent';
import VerNotasComponent from './components/VerNotasComponent';
function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/estudiantes" element={<EstudianteComponent />} />
        <Route path="/escoger-estudiante-cuota" element={<EscogerEstudianteCuotaComponent />} />
        <Route path="/estudiantes-con-cuotas" element={<EstudiantesConCuotasComponent />} />
        <Route path="/ver-cuotas/:rut" element={<VerCuotasComponent />} />
        <Route path="/subir-notas" element={<SubirNotasComponent />} />
        <Route path="/ver-notas" element={<VerNotasComponent />} />

      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;

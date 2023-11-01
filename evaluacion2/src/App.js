import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeComponent from './components/HomeComponent';
import RegisterComponent from './components/RegisterComponent';
import EstudianteComponent from './components/EstudiantesComponent';
import EscogerEstudianteCuotaComponent from './components/EscogerEstudianteCuotaComponent';
function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/estudiantes" element={<EstudianteComponent />} />
        <Route path="/escoger-estudiante-cuota" element={<EscogerEstudianteCuotaComponent />} />

      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;

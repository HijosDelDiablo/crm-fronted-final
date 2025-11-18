import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/login/login";
import Registro from "./pages/login/registro";
import "bootstrap/dist/css/bootstrap.min.css";

// import Login from "./pages/Login/Login"; // lo crearás después
// import Dashboard from "./pages/Dashboard/Dashboard"; // más adelante

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING COMO PÁGINA INICIAL */}
        <Route path="/" element={<Landing />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
        {/* REGISTRO */}
        <Route path="/registro" element={<Registro />} />

        {/* SISTEMA INTERNO */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* ETC */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

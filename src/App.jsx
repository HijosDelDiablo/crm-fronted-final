import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
// import Login from "./pages/Login/Login"; // lo crearás después
// import Dashboard from "./pages/Dashboard/Dashboard"; // más adelante

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING COMO PÁGINA INICIAL */}
        <Route path="/" element={<Landing />} />

        {/* LOGIN */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* SISTEMA INTERNO */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* ETC */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

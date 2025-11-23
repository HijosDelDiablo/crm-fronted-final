import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth/Auth";
import { useAuth } from "./hooks/useAuth";
import AuthContex from "./context/AuthContext";
import Login from "./pages/login/login";
import Registro from "./pages/login/registro";
import "bootstrap/dist/css/bootstrap.min.css";

// import Login from "./pages/Login/Login"; // lo crearás después
// import Dashboard from "./pages/Dashboard/Dashboard"; // más adelante

function App() {

  const { user, login, logout, setUser } = useAuth();

  return (
    <BrowserRouter>
      <AuthContex.Provider value={{ user, setUser }}>
        <Routes>
          {/* LANDING COMO PÁGINA INICIAL */}
          <Route path="/" element={<Landing />} />

          {/* LOGIN */}
          <Route path="/login" element={<Auth />} />


          {/* SISTEMA INTERNO */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          {/* ETC */}
        </Routes>
      </AuthContex.Provider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            padding: '10px 14px',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
          }
        }}
      />
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth/Auth";
import { AuthContextProvider } from "./context/AuthContextProvider";
import Login from "./pages/login/login";
import Registro from "./pages/login/registro";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginGoogle from "./pages/Auth/LoginGoogle";

// import Login from "./pages/Login/Login"; // lo crearás después
// import Dashboard from "./pages/Dashboard/Dashboard"; // más adelante

function App() {


  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          {/* LANDING COMO PÁGINA INICIAL */}
          <Route path="/" element={<Landing />} />

          {/* LOGIN */}
          <Route path="/login" element={<Auth />} />
          <Route path="/loginGoogle" element={<LoginGoogle />} />


          {/* SISTEMA INTERNO */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          {/* ETC */}
        </Routes>
      </AuthContextProvider>
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

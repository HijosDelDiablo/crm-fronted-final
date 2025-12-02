import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth/Auth";
import { AuthContextProvider } from "./context/AuthContextProvider";
import NotFound from "./pages/NotFound/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/inicio/Home";
import LoginGoogle from "./pages/Auth/LoginGoogle";
import ProtectedAdminRoutes from "./utils/ProtectedAdminRoutes";
import useHeartbeat from "./utils/useHeartBeat";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pricings from "./pages/Pricings/Pricings";
import Clients from "./pages/Clients/Clients";

// import Login from "./pages/Login/Login"; // lo crearás después
// import Dashboard from "./pages/Dashboard/Dashboard"; // más adelante

function App() {

  useHeartbeat();
  return (
    <BrowserRouter>
      <AuthContextProvider>

        <Routes>
          <Route path="*" element={<NotFound />} />
          {/* LANDING COMO PÁGINA INICIAL */}
          <Route path="/" element={<Landing />} />

          {/* LOGIN */}
          <Route path="/login" element={<Auth />} />
          <Route path="/loginGoogle" element={<LoginGoogle />} />


          {/* SISTEMA INTERNO */}
          <Route element={<ProtectedAdminRoutes />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricings" element={<Pricings />} />
            <Route path="/clientes" element={<Clients />} />
          </Route>

          {/* SISTEMA INTERNO, uso del dashboard */}
          {/* <Route path="panel" element={<PanelInicio />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/panel" element={<Home />} />
          {/* ETC */}
        </Routes>
      </AuthContextProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            padding: "10px 14px",
            fontSize: "14px",
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
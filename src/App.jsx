import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/login/login";
import Registro from "./pages/login/registro";
import Catalogo from "./pages/Client/Catalogo";
import MisCompras from "./pages/Client/MisCompras";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/shared/ProtectedRoute";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Cliente Protegidas */}
          <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
            <Route
              path="/client"
              element={
                <Layout>
                  <Catalogo />
                </Layout>
              }
            >
              <Route path="catalogo" element={<Catalogo />} />
              <Route path="mis-compras" element={<MisCompras />} />
            </Route>
          </Route>

          {/* Rutas Admin/Vendedor */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "VENDEDOR"]} />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <h1>Dashboard Admin</h1>
                </Layout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
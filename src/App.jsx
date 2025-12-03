import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing/Landing";
import Auth from "./pages/Auth/Auth";
import { AuthContextProvider } from "./context/AuthContextProvider";
import { ThemeProvider } from "./context/ThemeContext";
import NotFound from "./pages/NotFound/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/inicio/Home";
import LoginGoogle from "./pages/Auth/LoginGoogle";
import ProtectedAdminRoutes from "./utils/ProtectedAdminRoutes";
import useHeartbeat from "./utils/useHeartBeat";
import Dashboard from "./pages/AdminModules/Dashboard/Dashboard";
import Pricings from "./pages/AdminModules/Pricings/Pricings"
import Clients from "./pages/AdminModules/Clients/Clients";
import Products from "./pages/Products";
import Suppliers from "./pages/AdminModules/Suppliers/Suppliers";
import Sellers from "./pages/AdminModules/Sellers/Sellers";
import SellerReview from "./pages/AdminModules/Sellers/SellerReview";
import ViewProducts from "./pages/ViewProducts";
import ViewPurchases from "./pages/ViewPurchases";
import DashboardHome from "./pages/DashboardHome";

// Guards nuevos
import AuthGuard from "./guards/AuthGuard";
import AdminGuard from "./guards/AdminGuard";
import ClientGuard from "./guards/ClientGuard";

function App() {
  useHeartbeat();
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthContextProvider>
          <Routes>
            <Route path="*" element={<NotFound />} />

            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/loginGoogle" element={<LoginGoogle />} />

            {/* RUTAS ADMIN - Protegidas por AdminGuard */}
            <Route path="/admin/*" element={
              <AdminGuard>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="pricings" element={<Pricings />} />
                  <Route path="clientes" element={<Clients />} />
                  <Route path="vendedores" element={<Sellers />} />
                  <Route path="seller-reviews/:id" element={<SellerReview />} />
                  <Route path="suppliers" element={<Suppliers />} />
                  {/* TODO: Agregar rutas nuevas de compras/pagos en fases futuras */}
                </Routes>
              </AdminGuard>
            } />

            {/* RUTAS CLIENTE - Protegidas por ClientGuard */}
            <Route path="/cliente/*" element={
              <ClientGuard>
                <Routes>
                  <Route path="dashboard" element={<DashboardHome />} />
                  <Route path="catalogo" element={<ViewProducts />} />
                  <Route path="mis-compras" element={<ViewPurchases />} />
                  {/* TODO: Agregar rutas nuevas de cotizaciones/pagos en fases futuras */}
                  {/* TODO: Unificar con Client/Perfil.jsx existente */}
                </Routes>
              </ClientGuard>
            } />

            {/* RUTAS LEGACY - Temporalmente mantenidas para compatibilidad */}
            {/* TODO: Eliminar estas rutas legacy después de migrar navegación */}
            <Route element={<ProtectedAdminRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/pricings" element={<Pricings />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/vendedores" element={<Sellers />} />
              <Route path="/seller-reviews/:id" element={<SellerReview />} />
              <Route path="/suppliers" element={<Suppliers />} />
            </Route>

            <Route path="/panel" element={<DashboardHome />} />
            <Route path="/panel/carros" element={<ViewProducts />} />
            <Route path="/panel/mis-compras" element={<ViewPurchases />} />
          </Routes>
        </AuthContextProvider>
      </ThemeProvider>
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
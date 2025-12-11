import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";

// Context providers (cannot be lazy loaded)
import { AuthContextProvider } from "./context/AuthContextProvider";
import { ThemeProvider } from "./context/ThemeContext";

// Utils (cannot be lazy loaded)
import ProtectedAdminRoutes from "./utils/ProtectedAdminRoutes";
import useHeartbeat from "./utils/useHeartBeat";

// Lazy load components for better code splitting
const Landing = lazy(() => import("./pages/Landing/Landing"));
const Auth = lazy(() => import("./pages/Auth/Auth"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Home = lazy(() => import("./pages/inicio/Home"));
const LoginGoogle = lazy(() => import("./pages/Auth/LoginGoogle"));

// Admin components
const Dashboard = lazy(() => import("./pages/AdminModules/Dashboard/Dashboard"));
const Pricings = lazy(() => import("./pages/AdminModules/Pricings/Pricings"));
const Clients = lazy(() => import("./pages/AdminModules/Clients/Clients"));
const Products = lazy(() => import("./pages/Products"));
const Suppliers = lazy(() => import("./pages/AdminModules/Suppliers/Suppliers"));
const Sellers = lazy(() => import("./pages/AdminModules/Sellers/Sellers"));
const SellerReview = lazy(() => import("./pages/AdminModules/Sellers/SellerReview"));
const RevisarCompras = lazy(() => import("./pages/admin/RevisarCompras"));
const DetalleCompraAdmin = lazy(() => import("./pages/admin/DetalleCompraAdmin"));
const ComprasPorVendedor = lazy(() => import("./pages/admin/ComprasPorVendedor"));
const GestionPagos = lazy(() => import("./pages/admin/GestionPagos"));
const Gastos = lazy(() => import("./pages/admin/Gastos"));
const Admins = lazy(() => import("./pages/AdminModules/Admins/Admins"));

// Client components
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const ViewProducts = lazy(() => import("./pages/ViewProducts"));
const ViewPurchases = lazy(() => import("./pages/ViewPurchases"));
const MisCompras = lazy(() => import("./pages/Client/MisCompras"));
const MisPagos = lazy(() => import("./pages/Client/MisPagos.jsx"));
const MisCotizaciones = lazy(() => import("./pages/Client/MisCotizaciones"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const DetalleCompra = lazy(() => import("./pages/Client/DetalleCompra"));

// Guards
const AuthGuard = lazy(() => import("./guards/AuthGuard"));
const AdminGuard = lazy(() => import("./guards/AdminGuard"));
const ClientGuard = lazy(() => import("./guards/ClientGuard"));

function App() {
  useHeartbeat();

  // Loading fallback component
  const LoadingFallback = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1f2937',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #374151',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        Cargando Grandline Motors CRM...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthContextProvider>
            <Provider store={store}>
              <Toaster />
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
                      {/* Nuevas rutas admin */}
                      <Route path="compras" element={<RevisarCompras />} />
                      <Route path="compras/:id" element={<DetalleCompraAdmin />} />
                      <Route path="compras-por-vendedor" element={<ComprasPorVendedor />} />
                      <Route path="pagos" element={<GestionPagos />} />
                      <Route path="gastos" element={<Gastos />} />
                      <Route path="administradores" element={<Admins />} />
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
                      {/* Nuevas rutas cliente */}
                      <Route path="compras" element={<MisCompras />} />
                      <Route path="compras/:id" element={<DetalleCompra />} />
                      <Route path="pagos" element={<MisPagos />} />
                      <Route path="cotizaciones" element={<MisCotizaciones />} />
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

                <Route path="/panel" element={
                  <ClientGuard>
                    <DashboardHome />
                  </ClientGuard>
                } />

                {/* Ruta Compartida - Mi Perfil (Solo para Clientes) */}
                <Route path="/perfil" element={
                  <ClientGuard>
                    <MyProfile />
                  </ClientGuard>
                } />

                <Route path="/panel/carros" element={
                  <ClientGuard>
                    <ViewProducts />
                  </ClientGuard>
                } />
                <Route path="/panel/mis-compras" element={
                  <ClientGuard>
                    <ViewPurchases />
                  </ClientGuard>
                } />
              </Routes>
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
            </Provider>
          </AuthContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
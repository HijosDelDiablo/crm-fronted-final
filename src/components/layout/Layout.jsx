import NavbarTop from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <>
      <NavbarTop />

      <div className="layout-container">
        <Sidebar />
        <main className="page-content">
          {children}
        </main>
      </div>
    </>
  );
}

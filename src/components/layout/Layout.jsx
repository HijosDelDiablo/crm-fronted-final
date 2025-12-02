import NavbarTop from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";
import AIChatWidget from "../chat/AIChatWidget";

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

      <AIChatWidget /> 
    </>
  );
}

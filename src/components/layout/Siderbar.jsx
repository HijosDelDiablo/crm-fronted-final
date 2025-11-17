import "./Sidebar.css";
import {
  House,
  Box,
  Users,
  FileText,
  BarChart3,
  Bot
} from "lucide-react";

export default function Sidebar() {
  const menu = [
    { icon: <House size={20} />, label: "Dashboard" },
    { icon: <Box size={20} />, label: "Catálogo" },
    { icon: <Users size={20} />, label: "Usuarios" },
    { icon: <FileText size={20} />, label: "Cotizaciones" },
    { icon: <BarChart3 size={20} />, label: "Estadísticas" },
    { icon: <Bot size={20} />, label: "IA" }
  ];

  return (
    <aside className="sidebar">
      {menu.map((m, i) => (
        <div key={i} className="sidebar-item">
          {m.icon}
          <span>{m.label}</span>
        </div>
      ))}
    </aside>
  );
}

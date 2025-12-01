import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Spinner, Badge, Dropdown, Modal } from "react-bootstrap";
import { 
  Bot, X, Send, Zap, ChevronRight, Trash2, 
  Calendar, DollarSign, Users, BarChart3,
  Car, Phone, Mail, MapPin, Clock, AlertCircle,
  Download, Filter, TrendingUp, Star, Shield,
  MessageSquare, FileText, Settings, HelpCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import "./AIChat.css";

export default function AIChatWidget() {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeView, setActiveView] = useState("chat");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      const saved = localStorage.getItem(`chat_history_${user._id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMessages(parsed);
        } catch (e) {
          setMessages([getWelcomeMessage()]);
        }
      } else {
        setMessages([getWelcomeMessage()]);
      }
      
      loadSuggestionsForRole(user.rol);
    }
  }, [user]);

  const getWelcomeMessage = () => {
    const name = user?.nombre?.split(" ")[0] || "Usuario";
    const time = new Date().getHours();
    let greeting = "Buenos días";
    if (time >= 12 && time < 19) greeting = "Buenas tardes";
    if (time >= 19) greeting = "Buenas noches";
    
    return {
      role: "assistant",
      content: `${greeting} ${name}! Soy tu asistente IA de Autobots. \n\nPuedo ayudarte con:\n• Información de vehículos\n• Gestión de tareas\n• Reportes y análisis\n• Soporte y preguntas\n\nEscribe "/" para ver comandos rápidos o simplemente pregúntame lo que necesites.`,
      type: "text",
      timestamp: new Date().toISOString()
    };
  };

  const loadSuggestionsForRole = (role) => {
    const commonSuggestions = [
      { icon: <Car size={16} />, text: "Ver vehículos disponibles", query: "Muéstrame los autos disponibles" },
      { icon: <HelpCircle size={16} />, text: "Cómo funciona el financiamiento", query: "Explícame cómo funciona el financiamiento" },
      { icon: <Phone size={16} />, text: "Contactar con soporte", query: "Necesito contactar a soporte" },
    ];
    
    if (role === "CLIENTE") {
      setSuggestions([
        ...commonSuggestions,
        { icon: <Calendar size={16} />, text: "Agendar prueba de manejo", query: "Quiero agendar una prueba de manejo" },
        { icon: <DollarSign size={16} />, text: "Calcular financiamiento", query: "Calcula un financiamiento para un auto de $300,000" },
        { icon: <MessageSquare size={16} />, text: "Ver mis mensajes", query: "Tengo mensajes pendientes?" },
      ]);
    } else if (role === "VENDEDOR") {
      setSuggestions([
        ...commonSuggestions,
        { icon: <Users size={16} />, text: "Mis clientes", query: "Muéstrame mis clientes" },
        { icon: <BarChart3 size={16} />, text: "Mi rendimiento", query: "Cómo va mi rendimiento este mes?" },
        { icon: <FileText size={16} />, text: "Cotizaciones pendientes", query: "Tengo cotizaciones pendientes?" },
        { icon: <Calendar size={16} />, text: "Mis tareas de hoy", query: "Qué tengo pendiente para hoy?" },
      ]);
    } else if (role === "ADMIN") {
      setSuggestions([
        ...commonSuggestions,
        { icon: <TrendingUp size={16} />, text: "Reporte de ventas", query: "Dame el reporte de ventas del mes" },
        { icon: <Users size={16} />, text: "Rendimiento del equipo", query: "Cómo va el rendimiento del equipo?" },
        { icon: <DollarSign size={16} />, text: "Análisis de gastos", query: "Muéstrame los gastos del mes" },
        { icon: <BarChart3 size={16} />, text: "Análisis de inventario", query: "Necesito análisis del inventario" },
        { icon: <Shield size={16} />, text: "Configuración del sistema", query: "Opciones de configuración del CRM" },
      ]);
    }
  };

  useEffect(() => {
    if (user?._id && messages.length > 0) {
      const toSave = messages.map(msg => ({
        ...msg,
        data: msg.type === 'text' ? undefined : msg.data
      }));
      localStorage.setItem(`chat_history_${user._id}`, JSON.stringify(toSave));
      scrollToBottom();
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (textOverride = null) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    const userMessage = { 
      role: "user", 
      content: text, 
      type: "text",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setShowSlashMenu(false);
    setLoading(true);

    try {
      const { data } = await api.post("/iamodel/query", { prompt: text });
      
      const botResponse = {
        role: "assistant",
        content: data.message,
        type: data.type,       
        data: data.data,
        metadata: data.metadata,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Tuve un problema de conexión. Por favor, intenta de nuevo en un momento.", 
        type: "text",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setShowSlashMenu(val === "/");
  };

  const clearHistory = () => {
    if (window.confirm("¿Seguro que quieres borrar todo el historial de chat?")) {
      setMessages([getWelcomeMessage()]);
      localStorage.removeItem(`chat_history_${user?._id}`);
    }
  };

  const exportChat = () => {
    const exportObj = {
      user: user?.nombre,
      role: user?.rol,
      exportDate: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        type: msg.type,
        timestamp: msg.timestamp
      }))
    };
    
    setExportData(exportObj);
    setShowExportModal(true);
  };

  const handleExport = (format) => {
    if (!exportData) return;
    
    let content = "";
    if (format === "txt") {
      content = `Chat Export - ${new Date().toLocaleDateString()}\n`;
      content += `Usuario: ${exportData.user}\n`;
      content += `Rol: ${exportData.role}\n\n`;
      exportData.messages.forEach(msg => {
        content += `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}\n\n`;
      });
    } else if (format === "json") {
      content = JSON.stringify(exportData, null, 2);
    }
    
    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const renderContent = (msg) => {
    switch (msg.type) {
      case "text":
        return <ReactMarkdown>{msg.content}</ReactMarkdown>;
      
      case "products_grid":
      case "products_grid_admin":
        return (
          <div className="content-section">
            <div className="section-header">
              <Car size={18} />
              <h6>{msg.metadata?.viewType === 'slow_moving' ? '📦 Inventario Lento' : '🚗 Vehículos'}</h6>
              {msg.metadata?.totalValue && (
                <Badge bg="info" className="ms-auto">
                  ${msg.metadata.totalValue.toLocaleString()}
                </Badge>
              )}
            </div>
            <p className="mb-3">{msg.content}</p>
            <div className="grid-container">
              {msg.data?.map((car, index) => (
                <motion.div 
                  key={car._id || index}
                  className="product-card"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <div className="product-image">
                    <img 
                      src={car.imageUrl || "https://via.placeholder.com/150x100/4a6cf7/ffffff?text=Auto"} 
                      alt={`${car.marca} ${car.modelo}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150x100/cccccc/666666?text=Sin+Imagen";
                      }}
                    />
                    {car.stock < 3 && car.stock > 0 && (
                      <Badge bg="warning" className="stock-badge">
                        {car.stock} en stock
                      </Badge>
                    )}
                    {car.stock === 0 && (
                      <Badge bg="danger" className="stock-badge">
                        Agotado
                      </Badge>
                    )}
                  </div>
                  <div className="product-info">
                    <h6 className="product-title">{car.marca} {car.modelo}</h6>
                    <p className="product-year">{car.año || 'N/A'}</p>
                    <div className="product-price">
                      <DollarSign size={14} />
                      <strong>{car.precioBase?.toLocaleString() || 'N/A'}</strong>
                    </div>
                    <p className="product-type">{car.tipo || 'Sin categoría'}</p>
                    {car.promocion && (
                      <Badge bg="success" className="promo-badge">
                        Promoción
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {msg.data?.length > 0 && (
              <div className="section-footer">
                <small className="text-muted">
                  Mostrando {msg.data.length} de {msg.metadata?.totalCount || msg.data.length} resultados
                </small>
                <Button size="sm" variant="outline-primary" className="ms-2">
                  Ver todos
                </Button>
              </div>
            )}
          </div>
        );
      
      case "tasks_list_detailed":
        return (
          <div className="content-section">
            <div className="section-header">
              <Calendar size={18} />
              <h6>Tareas Pendientes</h6>
              {msg.metadata?.overdueCount > 0 && (
                <Badge bg="danger" className="ms-auto">
                  {msg.metadata.overdueCount} vencidas
                </Badge>
              )}
            </div>
            <p className="mb-3">{msg.content}</p>
            <div className="tasks-list">
              {msg.data?.map((task, index) => {
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                const isOverdue = dueDate < today;
                const isToday = dueDate.toDateString() === today.toDateString();
                
                return (
                  <div key={task._id || index} className={`task-item ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}>
                    <div className="task-checkbox">
                      <input type="checkbox" />
                    </div>
                    <div className="task-content">
                      <div className="task-title">{task.title || 'Tarea sin título'}</div>
                      <div className="task-meta">
                        {task.cliente?.nombre && (
                          <span className="client">
                            <Users size={12} /> {task.cliente.nombre}
                          </span>
                        )}
                        <span className="due-date">
                          <Calendar size={12} /> Vence: {dueDate.toLocaleDateString()}
                        </span>
                        {task.priority === 'alta' && (
                          <Badge bg="danger" size="sm">Urgente</Badge>
                        )}
                      </div>
                      <div className="task-description">
                        {task.description || 'Sin descripción'}
                      </div>
                    </div>
                    <div className="task-actions">
                      <Button size="sm" variant="outline-primary">
                        Ver
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case "kpi_dashboard_admin":
      case "kpi_dashboard_vendor":
        return (
          <div className="content-section">
            <div className="section-header">
              <BarChart3 size={18} />
              <h6>Reporte de Ventas</h6>
              <Badge bg={msg.metadata?.growthPercentage > 0 ? "success" : "warning"} className="ms-auto">
                {msg.metadata?.growthPercentage > 0 ? '+' : ''}{msg.metadata?.growthPercentage}%
              </Badge>
            </div>
            <p className="mb-3">{msg.content}</p>
            
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-value">${msg.data?.totalSales?.toLocaleString() || '0'}</div>
                <div className="kpi-label">Ventas Totales</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">{msg.data?.salesCount || '0'}</div>
                <div className="kpi-label">Unidades</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">${Math.round(msg.data?.averageTicket || 0).toLocaleString()}</div>
                <div className="kpi-label">Ticket Promedio</div>
              </div>
              {msg.data?.estimatedCommission && (
                <div className="kpi-card">
                  <div className="kpi-value">${Math.round(msg.data.estimatedCommission).toLocaleString()}</div>
                  <div className="kpi-label">Comisión Est.</div>
                </div>
              )}
            </div>
            
            {msg.data?.topVendors && (
              <div className="mt-3">
                <h6 className="mb-2">Top Vendedores</h6>
                <div className="vendors-list">
                  {msg.data.topVendors.map((vendor, index) => (
                    <div key={index} className="vendor-item">
                      <div className="vendor-rank">{index + 1}</div>
                      <div className="vendor-info">
                        <div className="vendor-name">
                          {vendor.vendedorInfo?.[0]?.nombre || 'Vendedor'}
                        </div>
                        <div className="vendor-stats">
                          ${vendor.total?.toLocaleString()} • {vendor.count} ventas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="section-footer">
              <Button size="sm" variant="outline-success" className="me-2">
                <Download size={14} /> Exportar
              </Button>
              <Button size="sm" variant="outline-primary">
                <BarChart3 size={14} /> Ver Detalles
              </Button>
            </div>
          </div>
        );
      
      case "company_info_detailed":
        return (
          <div className="content-section">
            <div className="section-header">
              <MapPin size={18} />
              <h6>Información de la Empresa</h6>
            </div>
            <p className="mb-3">{msg.content}</p>
            
            <div className="company-details">
              <div className="detail-item">
                <MapPin size={16} />
                <div>
                  <strong>Ubicación:</strong>
                  <p>{msg.data?.location}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <Clock size={16} />
                <div>
                  <strong>Horarios:</strong>
                  <p>{msg.data?.schedule.weekdays}<br />
                  {msg.data?.schedule.saturday}<br />
                  {msg.data?.schedule.sunday}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <Phone size={16} />
                <div>
                  <strong>Contacto:</strong>
                  <p>General: {msg.data?.contact.general}<br />
                  Soporte: {msg.data?.contact.support}<br />
                  Emergencias: {msg.data?.contact.emergencies}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <Mail size={16} />
                <div>
                  <strong>Servicios:</strong>
                  <ul className="services-list">
                    {msg.data?.services?.map((service, i) => (
                      <li key={i}>{service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="section-footer">
              <Button size="sm" variant="outline-primary" className="me-2">
                <MapPin size={14} /> Ver en Mapa
              </Button>
              <Button size="sm" variant="outline-success">
                <Phone size={14} /> Llamar Ahora
              </Button>
            </div>
          </div>
        );
      
      default:
        return <ReactMarkdown>{msg.content}</ReactMarkdown>;
    }
  };

  const getCommands = () => {
    if (user?.rol === "CLIENTE") {
      return [
        { cmd: "/autos", label: "Ver catálogo", icon: <Car size={14} />, query: "Muéstrame los autos disponibles" },
        { cmd: "/financiar", label: "Calcular financiamiento", icon: <DollarSign size={14} />, query: "Calcula un financiamiento" },
        { cmd: "/prueba", label: "Agendar prueba", icon: <Calendar size={14} />, query: "Quiero agendar una prueba de manejo" },
        { cmd: "/soporte", label: "Contactar soporte", icon: <Phone size={14} />, query: "Necesito contactar a soporte" },
        { cmd: "/ubicacion", label: "Ver ubicación", icon: <MapPin size={14} />, query: "Dónde están ubicados?" },
      ];
    } else if (user?.rol === "VENDEDOR") {
      return [
        { cmd: "/inventario", label: "Inventario", icon: <Car size={14} />, query: "Dame el listado de productos" },
        { cmd: "/tareas", label: "Mis tareas", icon: <Calendar size={14} />, query: "Dime las tareas pendientes" },
        { cmd: "/ventas", label: "Mis ventas", icon: <BarChart3 size={14} />, query: "Dame un reporte de mis ventas" },
        { cmd: "/clientes", label: "Mis clientes", icon: <Users size={14} />, query: "Muéstrame mis clientes" },
        { cmd: "/cotizaciones", label: "Cotizaciones pendientes", icon: <FileText size={14} />, query: "Muéstrame cotizaciones pendientes" },
      ];
    } else if (user?.rol === "ADMIN") {
      return [
        { cmd: "/reporte", label: "Reporte ventas", icon: <BarChart3 size={14} />, query: "Dame el reporte de ventas del mes" },
        { cmd: "/equipo", label: "Rendimiento equipo", icon: <TrendingUp size={14} />, query: "Cómo va el rendimiento del equipo?" },
        { cmd: "/gastos", label: "Análisis de gastos", icon: <DollarSign size={14} />, query: "Muéstrame los gastos del mes" },
        { cmd: "/inventario", label: "Análisis inventario", icon: <Car size={14} />, query: "Necesito análisis del inventario" },
        { cmd: "/config", label: "Configuración", icon: <Settings size={14} />, query: "Opciones de configuración" },
      ];
    }
    return [];
  };

  return (
    <>
      <motion.button
        className="ai-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          scale: isOpen ? 0.9 : 1,
          rotate: isOpen ? 90 : 0
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
        {!isOpen && messages.some(msg => msg.role === "assistant" && msg.type !== 'text') && (
          <span className="notification-badge"></span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-window glass-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="ai-header">
              <div className="d-flex align-items-center gap-2">
                <div className="ai-avatar">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h6 className="m-0 fw-bold">Autobots Assistant</h6>
                  <span className="ai-status">
                    <span className="dot"></span> En línea • {user?.rol}
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="btn-icon-ghost">
                    <Settings size={16} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={exportChat}>
                      <Download size={14} className="me-2" />
                      Exportar chat
                    </Dropdown.Item>
                    <Dropdown.Item onClick={clearHistory}>
                      <Trash2 size={14} className="me-2" />
                      Limpiar historial
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                      <HelpCircle size={14} className="me-2" />
                      Ayuda
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <button onClick={() => setIsOpen(false)} className="btn-icon-ghost">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="view-tabs">
              <button 
                className={`view-tab ${activeView === "chat" ? "active" : ""}`}
                onClick={() => setActiveView("chat")}
              >
                <MessageSquare size={14} />
                Chat
              </button>
              <button 
                className={`view-tab ${activeView === "suggestions" ? "active" : ""}`}
                onClick={() => setActiveView("suggestions")}
              >
                <Zap size={14} />
                Sugerencias
              </button>
              <button 
                className={`view-tab ${activeView === "history" ? "active" : ""}`}
                onClick={() => setActiveView("history")}
              >
                <FileText size={14} />
                Historial
              </button>
            </div>

            <div className="ai-content" ref={chatContainerRef}>
              {activeView === "chat" && (
                <>
                  <div className="ai-messages">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        className={`message-row ${msg.role}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="message-avatar">
                          {msg.role === "assistant" ? (
                            <Bot size={16} />
                          ) : (
                            <div className="user-avatar">
                              {user?.nombre?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="message-bubble">
                          <div className="message-header">
                            <span className="message-sender">
                              {msg.role === "assistant" ? "Autobots Assistant" : user?.nombre}
                            </span>
                            <span className="message-time">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="message-content">
                            {renderContent(msg)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {loading && (
                      <div className="message-row assistant">
                        <div className="message-avatar">
                          <Bot size={16} />
                        </div>
                        <div className="message-bubble loading">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="ai-input-area">
                    <AnimatePresence>
                      {showSlashMenu && (
                        <motion.div 
                          className="slash-menu"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <div className="slash-header">
                            <Zap size={14} />
                            <strong>Comandos rápidos</strong>
                            <small className="ms-auto">Presiona ↑↓ para navegar</small>
                          </div>
                          {getCommands().map((cmd, i) => (
                            <div 
                              key={i} 
                              className="slash-item"
                              onClick={() => handleSend(cmd.query)}
                              onMouseEnter={() => inputRef.current?.focus()}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <div className="slash-icon">
                                  {cmd.icon}
                                </div>
                                <div>
                                  <strong>{cmd.cmd}</strong>
                                  <div className="slash-desc">{cmd.label}</div>
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-muted" />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="quick-suggestions">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          className="quick-suggestion-btn"
                          onClick={() => handleSend(suggestion.query)}
                        >
                          {suggestion.icon}
                          {suggestion.text}
                        </button>
                      ))}
                    </div>

                    <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="d-flex gap-2">
                      <Form.Control
                        ref={inputRef}
                        type="text"
                        placeholder={`Pregunta algo... (Escribe "/" para comandos)`}
                        value={input}
                        onChange={handleInputChange}
                        className="ai-input"
                        autoFocus
                        disabled={loading}
                      />
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="btn-send"
                        disabled={loading || !input.trim()}
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Send size={18} />
                        )}
                      </Button>
                    </Form>
                  </div>
                </>
              )}

              {activeView === "suggestions" && (
                <div className="suggestions-view">
                  <h6 className="mb-3">¿En qué te puedo ayudar?</h6>
                  <div className="suggestions-grid">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        className="suggestion-card"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSend(suggestion.query);
                          setActiveView("chat");
                        }}
                      >
                        <div className="suggestion-icon">
                          {suggestion.icon}
                        </div>
                        <div className="suggestion-text">
                          {suggestion.text}
                        </div>
                        <ChevronRight size={16} className="text-muted" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeView === "history" && (
                <div className="history-view">
                  <h6 className="mb-3">Historial de Conversación</h6>
                  <div className="history-list">
                    {messages
                      .filter(msg => msg.type === 'text')
                      .map((msg, index) => (
                        <div key={index} className="history-item">
                          <div className="history-avatar">
                            {msg.role === "assistant" ? (
                              <Bot size={12} />
                            ) : (
                              <div className="user-avatar-sm">
                                {user?.nombre?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="history-content">
                            <div className="history-message">
                              {msg.content.length > 100 
                                ? msg.content.substring(0, 100) + '...'
                                : msg.content
                              }
                            </div>
                            <div className="history-time">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Exportar Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selecciona el formato de exportación:</p>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => handleExport("txt")}>
              Texto (.txt)
            </Button>
            <Button variant="outline-success" onClick={() => handleExport("json")}>
              JSON (.json)
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
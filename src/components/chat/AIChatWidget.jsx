import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Spinner, Badge } from "react-bootstrap";
import { Bot, X, Send, Zap, ChevronRight, Trash2 } from "lucide-react";
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
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      const saved = localStorage.getItem(`chat_history_${user._id}`);
      if (saved) setMessages(JSON.parse(saved));
      else {
        setMessages([{
          role: "assistant",
          content: `Hola ${user.nombre.split(" ")[0]}, soy tu asistente IA. Escribe "/" para ver opciones rápidas.`,
          type: "text"
        }]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?._id && messages.length > 0) {
      localStorage.setItem(`chat_history_${user._id}`, JSON.stringify(messages));
      scrollToBottom();
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clientCommands = [
    { cmd: "/autos", label: "Ver catálogo", query: "Muéstrame los autos disponibles" },
    { cmd: "/mis-compras", label: "Mis solicitudes", query: "Quiero ver mis compras" },
    { cmd: "/ayuda", label: "Ayuda financiera", query: "¿Cómo funciona el financiamiento?" },
  ];

  const adminCommands = [
    { cmd: "/inventario", label: "Inventario total", query: "Dame el listado de productos" },
    { cmd: "/tareas", label: "Gestión de tareas", query: "Dime las tareas pendientes" },
    { cmd: "/ventas", label: "Reporte ventas", query: "Dame un reporte de ventas del mes" },
    { cmd: "/pendientes", label: "Cotizaciones pendientes", query: "Muéstrame cotizaciones pendientes" },
  ];

  let commands = [];
  if (user?.rol === "CLIENTE") {
    commands = clientCommands;
  } else if (user?.rol === "ADMIN" || user?.rol === "VENDEDOR") {
    commands = adminCommands;
  }

  const handleSend = async (textOverride = null) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    const newMessage = { role: "user", content: text, type: "text" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setShowSlashMenu(false);
    setLoading(true);

    try {
      const { data } = await api.post("/iamodel/query", { prompt: text });
      
      const botResponse = {
        role: "assistant",
        content: data.message,
        type: data.type,       
        data: data.data     
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Tuve un error de conexión 🔌. Intenta de nuevo.", type: "text" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val === "/") setShowSlashMenu(true);
    else setShowSlashMenu(false);
  };

  const selectCommand = (cmd) => {
    handleSend(cmd.query);
  };

  const clearHistory = () => {
      setMessages([{ role: "assistant", content: "Historial borrado. ¿En qué te ayudo?", type: "text" }]);
      localStorage.removeItem(`chat_history_${user?._id}`);
  };

  const renderContent = (msg) => {
    if (msg.type === "text") {
      return <ReactMarkdown>{msg.content}</ReactMarkdown>;
    }

    if (msg.type === "products_grid") {
      return (
        <div>
          <p className="mb-2 fw-bold">{msg.content}</p>
          <div className="chat-grid">
            {msg.data?.map((car) => (
              <div key={car._id} className="chat-card">
                <img src={car.imageUrl || "https://via.placeholder.com/100"} alt="car" />
                <div className="p-2">
                  <small className="fw-bold d-block">{car.marca} {car.modelo}</small>
                  <small className="text-primary">${car.precioBase.toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === "tasks_list" || msg.type === "cotizaciones_table") {
      return (
        <div>
           <p className="mb-2 fw-bold">{msg.content}</p>
           <ul className="chat-list">
             {msg.data?.map((item, i) => (
               <li key={i}>
                 {item.title || `${item.coche?.marca} - ${item.cliente?.nombre}`}
                 {item.dueDate && <span className="d-block text-muted x-small">Vence: {item.dueDate.split('T')[0]}</span>}
               </li>
             ))}
           </ul>
        </div>
      );
    }
    
    return <p>{msg.content}</p>;
  };

  return (
    <>
      <motion.button
        className="ai-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-window glass-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="ai-header">
              <div className="d-flex align-items-center gap-2">
                <div className="ai-avatar">
                   <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h6 className="m-0 fw-bold">Autobots Assistant</h6>
                  <span className="ai-status">
                    <span className="dot"></span> En línea
                  </span>
                </div>
              </div>
              <button onClick={clearHistory} className="btn-icon-ghost" title="Borrar historial">
                  <Trash2 size={16} />
              </button>
            </div>

            <div className="ai-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-row ${msg.role}`}>
                  <div className="message-bubble">
                    {renderContent(msg)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message-row assistant">
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
                {showSlashMenu && commands.length > 0 && (
                  <motion.div 
                    className="slash-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <small className="text-muted d-block px-2 mb-1">Comandos rápidos:</small>
                    {commands.map((cmd, i) => (
                      <div key={i} className="slash-item" onClick={() => selectCommand(cmd)}>
                        <div className="d-flex align-items-center gap-2">
                            <Zap size={14} className="text-warning"/>
                            <strong>{cmd.cmd}</strong>
                        </div>
                        <small>{cmd.label}</small>
                        <ChevronRight size={14} className="ms-auto text-muted"/>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="d-flex gap-2">
                <Form.Control
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe un mensaje o / para comandos..."
                  value={input}
                  onChange={handleInputChange}
                  className="ai-input"
                  autoFocus
                />
                <Button type="submit" variant="primary" className="btn-send" disabled={loading || !input.trim()}>
                  <Send size={18} />
                </Button>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
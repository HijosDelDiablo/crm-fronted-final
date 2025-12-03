import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Spinner, Badge, Dropdown, Modal } from "react-bootstrap";
import {
  Bot, X, Send, Zap, ChevronRight, Trash2,
  Calendar, DollarSign, Users, BarChart3,
  Car, Phone, Mail, MapPin, Clock, AlertCircle,
  Download, Filter, TrendingUp, Star, Shield,
  MessageSquare, FileText, Settings, HelpCircle, User
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import "./AIChat.css";

export default function AIChatWidget({ externalIsOpen, onExternalClose, hideFloatButton = false }) {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(externalIsOpen || false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeView, setActiveView] = useState("chat");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState(null);

  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

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
    if (role === "CLIENTE") {
      setSuggestions([
        { icon: <Car size={16} />, text: "Ver autos disponibles", query: "Muéstrame los autos disponibles" },
        { icon: <Car size={16} />, text: "Buscar autos específicos", query: "Busca autos Mazda" },
        { icon: <DollarSign size={16} />, text: "Calcular financiamiento", query: "Calcula financiamiento para $300,000 con 20% de enganche a 48 meses" },
        { icon: <HelpCircle size={16} />, text: "Cómo funciona el financiamiento", query: "Explícame cómo funciona el financiamiento" },
        { icon: <Calendar size={16} />, text: "Agendar prueba de manejo", query: "Quiero agendar una prueba de manejo" },
        { icon: <MapPin size={16} />, text: "Información de contacto", query: "Dónde están ubicados" },
        { icon: <Star size={16} />, text: "Mejores vendedores", query: "Quiénes son los mejores vendedores" },
        { icon: <Phone size={16} />, text: "Contactar con soporte", query: "Necesito contactar a soporte" },
        { icon: <MessageSquare size={16} />, text: "Ver mis cotizaciones", query: "Estado de mis cotizaciones" },
        { icon: <User size={16} />, text: "Ver mi perfil", query: "Quién soy" },
      ]);
    } else if (role === "VENDEDOR") {
      setSuggestions([
        // All CLIENTE suggestions
        { icon: <Car size={16} />, text: "Ver autos disponibles", query: "Muéstrame los autos disponibles" },
        { icon: <Car size={16} />, text: "Buscar autos específicos", query: "Busca autos Mazda" },
        { icon: <DollarSign size={16} />, text: "Calcular financiamiento", query: "Calcula financiamiento para $300,000 con 20% de enganche a 48 meses" },
        { icon: <HelpCircle size={16} />, text: "Cómo funciona el financiamiento", query: "Explícame cómo funciona el financiamiento" },
        { icon: <Calendar size={16} />, text: "Agendar prueba de manejo", query: "Quiero agendar una prueba de manejo" },
        { icon: <MapPin size={16} />, text: "Información de contacto", query: "Dónde están ubicados" },
        { icon: <Star size={16} />, text: "Mejores vendedores", query: "Quiénes son los mejores vendedores" },
        { icon: <Phone size={16} />, text: "Contactar con soporte", query: "Necesito contactar a soporte" },
        { icon: <MessageSquare size={16} />, text: "Ver mis cotizaciones", query: "Estado de mis cotizaciones" },
        { icon: <User size={16} />, text: "Ver mi perfil", query: "Quién soy" },
        // VENDEDOR specific
        { icon: <HelpCircle size={16} />, text: "Qué puede hacer un cliente", query: "Qué puede hacer un cliente" },
        { icon: <Users size={16} />, text: "Cliente con más compras", query: "Cliente con más compras" },
        { icon: <Car size={16} />, text: "Autos con más stock", query: "Autos con más stock" },
        { icon: <BarChart3 size={16} />, text: "Resumen de autos", query: "Resumen de autos" },
        { icon: <BarChart3 size={16} />, text: "Resumen de clientes", query: "Resumen de clientes" },
        { icon: <Calendar size={16} />, text: "Mis tareas pendientes", query: "Mis tareas" },
        { icon: <FileText size={16} />, text: "Cotizaciones pendientes", query: "Cotizaciones pendientes" },
        { icon: <Users size={16} />, text: "Mis clientes", query: "Mis clientes" },
        { icon: <BarChart3 size={16} />, text: "Reportes de ventas", query: "Ventas de este mes" },
        { icon: <DollarSign size={16} />, text: "Gastos del mes", query: "Gastos del mes" },
        { icon: <TrendingUp size={16} />, text: "Mi rendimiento", query: "Mi rendimiento" },
        { icon: <BarChart3 size={16} />, text: "Análisis de inventario", query: "Análisis de inventario" },
      ]);
    } else if (role === "ADMIN") {
      setSuggestions([
        // All VENDEDOR suggestions (which include CLIENTE)
        { icon: <Car size={16} />, text: "Ver autos disponibles", query: "Muéstrame los autos disponibles" },
        { icon: <Car size={16} />, text: "Buscar autos específicos", query: "Busca autos Mazda" },
        { icon: <DollarSign size={16} />, text: "Calcular financiamiento", query: "Calcula financiamiento para $300,000 con 20% de enganche a 48 meses" },
        { icon: <HelpCircle size={16} />, text: "Cómo funciona el financiamiento", query: "Explícame cómo funciona el financiamiento" },
        { icon: <Calendar size={16} />, text: "Agendar prueba de manejo", query: "Quiero agendar una prueba de manejo" },
        { icon: <MapPin size={16} />, text: "Información de contacto", query: "Dónde están ubicados" },
        { icon: <Star size={16} />, text: "Mejores vendedores", query: "Quiénes son los mejores vendedores" },
        { icon: <Phone size={16} />, text: "Contactar con soporte", query: "Necesito contactar a soporte" },
        { icon: <MessageSquare size={16} />, text: "Ver mis cotizaciones", query: "Estado de mis cotizaciones" },
        { icon: <User size={16} />, text: "Ver mi perfil", query: "Quién soy" },
        { icon: <HelpCircle size={16} />, text: "Qué puede hacer un cliente", query: "Qué puede hacer un cliente" },
        { icon: <Users size={16} />, text: "Cliente con más compras", query: "Cliente con más compras" },
        { icon: <Car size={16} />, text: "Autos con más stock", query: "Autos con más stock" },
        { icon: <BarChart3 size={16} />, text: "Resumen de autos", query: "Resumen de autos" },
        { icon: <BarChart3 size={16} />, text: "Resumen de clientes", query: "Resumen de clientes" },
        { icon: <Calendar size={16} />, text: "Mis tareas pendientes", query: "Mis tareas" },
        { icon: <FileText size={16} />, text: "Cotizaciones pendientes", query: "Cotizaciones pendientes" },
        { icon: <Users size={16} />, text: "Mis clientes", query: "Mis clientes" },
        { icon: <BarChart3 size={16} />, text: "Reportes de ventas", query: "Ventas de este mes" },
        { icon: <DollarSign size={16} />, text: "Gastos del mes", query: "Gastos del mes" },
        { icon: <TrendingUp size={16} />, text: "Mi rendimiento", query: "Mi rendimiento" },
        { icon: <BarChart3 size={16} />, text: "Análisis de inventario", query: "Análisis de inventario" },
        // ADMIN specific
        { icon: <Users size={16} />, text: "Resumen de empleados", query: "Resumen de empleados" },
        { icon: <TrendingUp size={16} />, text: "Rendimiento del equipo", query: "Rendimiento del equipo" },
        { icon: <FileText size={16} />, text: "Cotizaciones pendientes globales", query: "Todas las cotizaciones pendientes" },
        { icon: <Users size={16} />, text: "Base completa de clientes", query: "Lista de todos los clientes" },
        { icon: <BarChart3 size={16} />, text: "Reportes de ventas globales", query: "Ventas totales de la empresa" },
        { icon: <DollarSign size={16} />, text: "Gastos administrativos", query: "Todos los gastos" },
        { icon: <BarChart3 size={16} />, text: "Análisis de inventario completo", query: "Análisis global de inventario" },
      ]);
    } else {
      // Default suggestions for unknown roles
      setSuggestions([
        { icon: <Car size={16} />, text: "Ver vehículos disponibles", query: "Muéstrame los autos disponibles" },
        { icon: <HelpCircle size={16} />, text: "Cómo funciona el financiamiento", query: "Explícame cómo funciona el financiamiento" },
        { icon: <Phone size={16} />, text: "Contactar con soporte", query: "Necesito contactar a soporte" },
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

  const classifyIntentByRole = (text, role) => {
    const lowerText = text.toLowerCase().trim();

    // Common intents for all roles
    const commonPatterns = {
      show_available_cars: /(muéstrame|mueestrame|ver|mostrar)\s+(los\s+)?autos?\s+(disponibles?|inventario|qué\s+tienes?|que\s+tienes?)/i,
      search_cars: /(busca|buscar|encuéntrame|encuentrame|busqueda|buscar)\s+autos?\s+(.+)/i,
      financing_calc: /(calcula|calcular)\s+financiamiento\s+(.+)/i,
      financing_explain: /(cómo\s+funciona|como\s+funciona|explica|explícame|explicame)\s+(el\s+)?financiamiento/i,
      schedule_test_drive: /(agendar|agendar\s+una?|quiero|reservar)\s+(prueba\s+de\s+)?manejo/i,
      contact_info: /(dónde\s+está|donde\s+esta|ubicación|ubicacion|teléfono|telefono|horarios?|contacto|información\s+de\s+contacto|informacion\s+de\s+contacto)/i,
      top_sellers: /(mejores?\s+)?vendedores?\s+(top|mejores?)/i,
      contact_support: /(contactar|necesito|ayuda|soporte|problema)/i,
      view_profile: /(quién\s+soy|quien\s+soy|mi\s+perfil|mis\s+datos)/i,
      view_messages: /(estado\s+de\s+mis\s+cotizaciones|mensajes?\s+pendientes?|cotizaciones?\s+pendientes?)/i
    };

    // Role-specific patterns
    const rolePatterns = {
      CLIENTE: {
        ...commonPatterns
      },
      VENDEDOR: {
        ...commonPatterns,
        client_capabilities: /(qué\s+puede\s+hacer|que\s+puede\s+hacer)\s+un\s+cliente/i,
        top_client: /(cliente\s+con\s+más\s+compras|cliente\s+con\s+mas\s+compras|top\s+cliente)/i,
        cars_most_stock: /(autos?\s+con\s+más\s+stock|autos?\s+con\s+mas\s+stock|inventario\s+más\s+grande|inventario\s+mas\s+grande)/i,
        summary_cars: /(resumen\s+de\s+autos|estadísticas\s+de\s+autos|estadisticas\s+de\s+autos)/i,
        summary_clients: /(resumen\s+de\s+clientes|estadísticas\s+de\s+clientes|estadisticas\s+de\s+clientes)/i,
        my_tasks: /(mis\s+tareas|pendientes|agenda|tareas\s+pendientes)/i,
        pending_quotes: /(cotizaciones?\s+pendientes|por\s+aprobar)/i,
        my_clients: /(mis\s+clientes|prospectos?\s+asignados?)/i,
        sales_report: /(ventas\s+de\s+este\s+mes|reporte\s+de\s+(ventas|ganancias))/i,
        expenses: /(gastos\s+del\s+mes|luz|agua|etc)/i,
        my_performance: /(mi\s+rendimiento|desempeño\s+personal|desempeno\s+personal)/i,
        inventory_analysis: /(análisis\s+de\s+inventario|analisis\s+de\s+inventario|stock\s+lento)/i
      },
      ADMIN: {
        ...rolePatterns.VENDEDOR,
        summary_employees: /(resumen\s+de\s+empleados|estadísticas\s+de\s+empleados|estadisticas\s+de\s+empleados)/i,
        team_performance: /(rendimiento\s+del\s+equipo|equipo\s+de\s+ventas)/i,
        all_pending_quotes: /(todas\s+las\s+cotizaciones?\s+pendientes)/i,
        all_clients: /(lista\s+de\s+todos\s+los\s+clientes|base\s+completa\s+de\s+clientes)/i,
        global_sales_report: /(ventas\s+totales\s+de\s+la\s+empresa)/i,
        admin_expenses: /(todos\s+los\s+gastos|gastos\s+administrativos)/i,
        global_inventory_analysis: /(análisis\s+global\s+de\s+inventario|analisis\s+global\s+de\s+inventario)/i
      }
    };

    const patterns = rolePatterns[role] || commonPatterns;

    for (const [intent, regex] of Object.entries(patterns)) {
      const match = lowerText.match(regex);
      if (match) {
        return { intent, params: match.slice(1) };
      }
    }

    return { intent: "unknown" };
  };

  const processIntent = async (intentData, role) => {
    const { intent, params } = intentData;

    switch (intent) {
      case "show_available_cars":
        try {
          const { data } = await api.get("/products/all");
          const availableCars = data.filter(car => car.stock > 0);
          return {
            content: `Aquí tienes los autos disponibles en nuestro inventario (${availableCars.length} vehículos):`,
            type: "products_grid",
            data: availableCars,
            metadata: { totalCount: availableCars.length, viewType: 'available' }
          };
        } catch (error) {
          return {
            content: "Lo siento, no pude obtener la información de los autos disponibles en este momento.",
            type: "text"
          };
        }

      case "search_cars":
        const searchTerm = params[1] || params[0];
        try {
          const { data } = await api.get("/products/all");
          const filteredCars = data.filter(car =>
            car.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return {
            content: `Encontré ${filteredCars.length} autos que coinciden con "${searchTerm}":`,
            type: "products_grid",
            data: filteredCars,
            metadata: { totalCount: filteredCars.length, searchTerm }
          };
        } catch (error) {
          return {
            content: "Lo siento, no pude realizar la búsqueda en este momento.",
            type: "text"
          };
        }

      case "financing_calc":
        // Simple financing calculation - in real app, this might be more complex
        const calcText = params[1] || params[0];
        const priceMatch = calcText.match(/\$?(\d{1,3}(?:,\d{3})*|\d+)/);
        const engancheMatch = calcText.match(/(\d+)%?\s+de\s+enganche/);
        const mesesMatch = calcText.match(/(\d+)\s+meses/);

        if (priceMatch && engancheMatch && mesesMatch) {
          const precio = parseInt(priceMatch[1].replace(/,/g, ''));
          const enganchePct = parseInt(engancheMatch[1]);
          const meses = parseInt(mesesMatch[1]);

          const enganche = precio * (enganchePct / 100);
          const financiado = precio - enganche;
          const mensualidad = financiado / meses;

          return {
            content: `Cálculo de financiamiento:\n\n💰 Precio total: $${precio.toLocaleString()}\n📉 Enganche (${enganchePct}%): $${enganche.toLocaleString()}\n💳 Monto a financiar: $${financiado.toLocaleString()}\n📅 Plazo: ${meses} meses\n💵 Pago mensual aproximado: $${Math.round(mensualidad).toLocaleString()}\n\n*Este es un cálculo aproximado. Consulta con un asesor para detalles exactos.*`,
            type: "text"
          };
        } else {
          return {
            content: "Para calcular el financiamiento necesito: precio del auto, porcentaje de enganche y plazo en meses. Ejemplo: 'Calcula financiamiento para $300,000 con 20% de enganche a 48 meses'",
            type: "text"
          };
        }

      case "financing_explain":
        return {
          content: `**¿Cómo funciona el financiamiento en Autobots?**\n\n🏦 **Proceso simple:**\n• Elige tu auto ideal\n• Define el enganche (mínimo 20%)\n• Selecciona el plazo (hasta 72 meses)\n• Obtén aprobación inmediata\n\n💡 **Beneficios:**\n• Tasas competitivas desde 12%\n• Sin comisiones ocultas\n• Pago mensual fijo\n• Posibilidad de prepago sin penalización\n\n📞 **¿Necesitas más detalles?** Contacta a un asesor o llama al 477 123 4567`,
          type: "text"
        };

      case "schedule_test_drive":
        return {
          content: `¡Excelente! Para agendar una prueba de manejo:\n\n📅 **Pasos a seguir:**\n1. Elige el auto que te interesa\n2. Selecciona fecha y hora disponible\n3. Proporciona tus datos básicos\n4. Recibe confirmación inmediata\n\n🚗 **Disponibilidad:** Lunes a sábado, 9:00 AM - 6:00 PM\n\n📱 **¿Quieres proceder?** Dime qué auto te interesa y te ayudo con el proceso.\n\nO contacta directamente: soporte@autobots.mx | 477 123 4567`,
          type: "text"
        };

      case "contact_info":
        return {
          content: `**Información de contacto - Autobots Concesionaria**\n\n📍 **Ubicación:**\nAv. Tecnológico #123, León, Guanajuato\n\n📞 **Teléfonos:**\n• Ventas: 477 123 4567\n• Soporte: 477 123 4568\n• WhatsApp: 477 999 8888\n\n🕒 **Horarios:**\n• Lunes a viernes: 9:00 AM - 7:00 PM\n• Sábado: 9:00 AM - 5:00 PM\n• Domingo: Cerrado\n\n📧 **Email:** info@autobots.mx\n\n🌐 **Redes sociales:** @autobots_mx`,
          type: "text"
        };

      case "top_sellers":
        try {
          const { data } = await api.get("/dashboard/top-vendedores");
          return {
            content: `**Top Vendedores del mes:**\n\n${data.map((seller, index) => `${index + 1}. ${seller.nombre} - ${seller.ventas} ventas ($${seller.total.toLocaleString()})`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener la información de los mejores vendedores en este momento.",
            type: "text"
          };
        }

      case "contact_support":
        return {
          content: `**¿Necesitas ayuda?**\n\n📧 **Email:** soporte@autobots.mx\n📞 **Teléfono:** 477 123 4567\n💬 **Chat en línea:** Disponible 24/7\n\n*Respuesta garantizada en menos de 24 horas*`,
          type: "text"
        };

      case "view_profile":
        return {
          content: `**Tu perfil:**\n\n👤 **Nombre:** ${user?.nombre || 'N/A'}\n📧 **Email:** ${user?.email || 'N/A'}\n🏷️ **Rol:** ${user?.rol || 'N/A'}\n📅 **Miembro desde:** ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}`,
          type: "text"
        };

      case "view_messages":
        try {
          const endpoint = role === 'CLIENTE' ? '/cotizaciones/mis-cotizaciones' : '/cotizaciones/pendientes';
          const { data } = await api.get(endpoint);
          const pending = data.filter(c => c.estado === 'pendiente');
          return {
            content: `Tienes ${pending.length} cotizaciones pendientes:\n\n${pending.map(c => `• ${c.coche?.marca} ${c.coche?.modelo} - $${c.montoTotal?.toLocaleString()} (${c.estado})`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener tus cotizaciones en este momento.",
            type: "text"
          };
        }

      // VENDEDOR specific intents
      case "client_capabilities":
        return {
          content: `**Un cliente puede hacer lo siguiente:**\n\n• Ver autos disponibles\n• Buscar autos específicos\n• Calcular financiamiento\n• Agendar prueba de manejo\n• Ver información de contacto\n• Consultar mejores vendedores\n• Contactar soporte\n• Ver su perfil y cotizaciones`,
          type: "text"
        };

      case "top_client":
        try {
          const { data } = await api.get("/dashboard/top-clientes");
          if (data.length > 0) {
            const topClient = data[0];
            return {
              content: `**Cliente con más compras:**\n\n👤 ${topClient.nombre}\n💰 Total comprado: $${topClient.totalComprado?.toLocaleString()}\n🛒 Compras realizadas: ${topClient.totalCompras}`,
              type: "text"
            };
          } else {
            return {
              content: "No hay información de clientes disponible.",
              type: "text"
            };
          }
        } catch (error) {
          return {
            content: "No pude obtener la información del top cliente.",
            type: "text"
          };
        }

      case "cars_most_stock":
        try {
          const { data } = await api.get("/products/all");
          const sortedByStock = data.sort((a, b) => b.stock - a.stock).slice(0, 10);
          return {
            content: `**Autos con más stock:**\n\n${sortedByStock.map((car, index) => `${index + 1}. ${car.marca} ${car.modelo} - ${car.stock} unidades`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener la información del inventario.",
            type: "text"
          };
        }

      case "summary_cars":
        try {
          const { data } = await api.get("/products/all");
          const totalCars = data.length;
          const availableCars = data.filter(c => c.stock > 0).length;
          const totalValue = data.reduce((sum, c) => sum + (c.precioBase * c.stock), 0);
          return {
            content: `**Resumen de autos:**\n\n🚗 Total de autos: ${totalCars}\n✅ Disponibles: ${availableCars}\n❌ Agotados: ${totalCars - availableCars}\n💰 Valor total inventario: $${totalValue.toLocaleString()}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener el resumen de autos.",
            type: "text"
          };
        }

      case "summary_clients":
        try {
          const { data } = await api.get("/clients/all");
          const totalClients = data.length;
          const activeClients = data.filter(c => c.activo).length;
          return {
            content: `**Resumen de clientes:**\n\n👥 Total de clientes: ${totalClients}\n✅ Activos: ${activeClients}\n⏸️ Inactivos: ${totalClients - activeClients}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener el resumen de clientes.",
            type: "text"
          };
        }

      case "my_tasks":
        try {
          const { data } = await api.get(`/tasks/user/${user?._id}`);
          const pendingTasks = data.filter(t => t.estado !== 'completada');
          return {
            content: `Tienes ${pendingTasks.length} tareas pendientes:\n\n${pendingTasks.map(t => `• ${t.titulo} - Vence: ${new Date(t.fechaVencimiento).toLocaleDateString()}`).join('\n')}`,
            type: "tasks_list_detailed",
            data: pendingTasks,
            metadata: { totalCount: pendingTasks.length }
          };
        } catch (error) {
          return {
            content: "No pude obtener tus tareas pendientes.",
            type: "text"
          };
        }

      case "pending_quotes":
        try {
          const { data } = await api.get("/cotizaciones/pendientes");
          return {
            content: `Hay ${data.length} cotizaciones pendientes de aprobación:\n\n${data.map(c => `• ${c.cliente?.nombre} - ${c.coche?.marca} ${c.coche?.modelo} - $${c.montoTotal?.toLocaleString()}`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener las cotizaciones pendientes.",
            type: "text"
          };
        }

      case "my_clients":
        try {
          const { data } = await api.get(`/clients/vendedor/${user?._id}`);
          return {
            content: `Tus clientes asignados (${data.length}):\n\n${data.map(c => `• ${c.nombre} - ${c.email} - ${c.estado}`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener la lista de tus clientes.",
            type: "text"
          };
        }

      case "sales_report":
        try {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          const endDate = new Date();
          const { data } = await api.get(`/dashboard/reporte-ventas?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
          return {
            content: `**Tu reporte de ventas del mes:**\n\n💰 Ventas totales: $${data.totalSales?.toLocaleString()}\n🛒 Unidades vendidas: ${data.salesCount}\n📊 Ticket promedio: $${Math.round(data.averageTicket || 0).toLocaleString()}`,
            type: "kpi_dashboard_vendor",
            data: data,
            metadata: { growthPercentage: 0 }
          };
        } catch (error) {
          return {
            content: "No pude obtener tu reporte de ventas.",
            type: "text"
          };
        }

      case "expenses":
        try {
          const { data } = await api.get("/gastos/mes-actual");
          const totalGastos = data.reduce((sum, g) => sum + g.monto, 0);
          return {
            content: `**Gastos del mes:** $${totalGastos.toLocaleString()}\n\n${data.map(g => `• ${g.descripcion}: $${g.monto.toLocaleString()}`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener los gastos del mes.",
            type: "text"
          };
        }

      case "my_performance":
        try {
          const { data } = await api.get(`/vendedores/performance/${user?._id}`);
          return {
            content: `**Tu rendimiento este mes:**\n\n🎯 Meta de ventas: $${data.metaVentas?.toLocaleString()}\n💰 Ventas realizadas: $${data.ventasRealizadas?.toLocaleString()}\n📈 Porcentaje cumplido: ${data.porcentajeCumplido}%\n🏆 Posición en ranking: ${data.posicionRanking}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener tu rendimiento.",
            type: "text"
          };
        }

      case "inventory_analysis":
        try {
          const { data } = await api.get("/products/all");
          const slowMoving = data.filter(c => c.stock > 5 && c.ultimaVenta && (new Date() - new Date(c.ultimaVenta)) > 30 * 24 * 60 * 60 * 1000);
          return {
            content: `**Análisis de inventario:**\n\n📦 Autos con stock lento (${slowMoving.length}):\n${slowMoving.slice(0, 5).map(c => `• ${c.marca} ${c.modelo} - ${c.stock} unidades`).join('\n')}`,
            type: "products_grid_admin",
            data: slowMoving,
            metadata: { totalCount: slowMoving.length, viewType: 'slow_moving' }
          };
        } catch (error) {
          return {
            content: "No pude realizar el análisis de inventario.",
            type: "text"
          };
        }

      // ADMIN specific intents
      case "summary_employees":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const { data } = await api.get("/empleados/all");
          const vendedores = data.filter(e => e.rol === 'VENDEDOR');
          const admins = data.filter(e => e.rol === 'ADMIN');
          return {
            content: `**Resumen de empleados:**\n\n👥 Total empleados: ${data.length}\n💼 Vendedores: ${vendedores.length}\n👑 Administradores: ${admins.length}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener el resumen de empleados.",
            type: "text"
          };
        }

      case "team_performance":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const { data } = await api.get("/vendedores/performance-all");
          return {
            content: `**Rendimiento del equipo:**\n\n${data.map((v, index) => `${index + 1}. ${v.nombre} - ${v.porcentajeCumplido}% meta`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener el rendimiento del equipo.",
            type: "text"
          };
        }

      case "all_pending_quotes":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const { data } = await api.get("/cotizaciones/pendientes");
          return {
            content: `Todas las cotizaciones pendientes (${data.length}):\n\n${data.map(c => `• ${c.cliente?.nombre} - ${c.coche?.marca} ${c.coche?.modelo} - $${c.montoTotal?.toLocaleString()}`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener todas las cotizaciones pendientes.",
            type: "text"
          };
        }

      case "all_clients":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const { data } = await api.get("/clients/all");
          return {
            content: `Base completa de clientes (${data.length}):\n\n${data.slice(0, 10).map(c => `• ${c.nombre} - ${c.email} - ${c.estado}`).join('\n')}${data.length > 10 ? '\n\n...y más clientes' : ''}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener la base de clientes.",
            type: "text"
          };
        }

      case "global_sales_report":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          const endDate = new Date();
          const { data } = await api.get(`/dashboard/reporte-ventas-global?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
          return {
            content: `**Ventas totales de la empresa:**\n\n💰 Total: $${data.totalSales?.toLocaleString()}\n🛒 Unidades: ${data.salesCount}\n📊 Crecimiento: ${data.growthPercentage}%`,
            type: "kpi_dashboard_admin",
            data: data,
            metadata: { growthPercentage: data.growthPercentage || 0 }
          };
        } catch (error) {
          return {
            content: "No pude obtener el reporte global de ventas.",
            type: "text"
          };
        }

      case "admin_expenses":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const { data } = await api.get("/gastos/all");
          const totalGastos = data.reduce((sum, g) => sum + g.monto, 0);
          return {
            content: `**Todos los gastos:** $${totalGastos.toLocaleString()}\n\n${data.map(g => `• ${g.descripcion}: $${g.monto.toLocaleString()}`).join('\n')}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude obtener todos los gastos.",
            type: "text"
          };
        }

      case "global_inventory_analysis":
        if (role !== 'ADMIN') {
          return {
            content: "No tienes permisos para acceder a esta información.",
            type: "text"
          };
        }
        try {
          const { data } = await api.get("/products/all");
          const totalValue = data.reduce((sum, c) => sum + (c.precioBase * c.stock), 0);
          const lowStock = data.filter(c => c.stock <= 2);
          return {
            content: `**Análisis global de inventario:**\n\n💰 Valor total: $${totalValue.toLocaleString()}\n⚠️ Autos con stock bajo: ${lowStock.length}\n📊 Total referencias: ${data.length}`,
            type: "text"
          };
        } catch (error) {
          return {
            content: "No pude realizar el análisis global de inventario.",
            type: "text"
          };
        }

      default:
        return {
          content: "De momento no puedo responder esa pregunta. Contacta con: soporte@autobots.mx o llama al 477 123 4567",
          type: "text"
        };
    }
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
      const intentData = classifyIntentByRole(text, user?.rol);
      const responseData = await processIntent(intentData, user?.rol);

      const botResponse = {
        role: "assistant",
        content: responseData.content,
        type: responseData.type,
        data: responseData.data,
        metadata: responseData.metadata,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing intent:', error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Tuve un problema procesando tu solicitud. Por favor, intenta de nuevo en un momento.",
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
      {!hideFloatButton && (
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
      )}

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
                <button onClick={() => { setIsOpen(false); onExternalClose && onExternalClose(); }} className="btn-icon-ghost">
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
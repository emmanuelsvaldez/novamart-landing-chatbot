import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, Sparkles, 
  RefreshCw, ShieldAlert, CheckCircle, HelpCircle, ChevronDown
} from 'lucide-react';

const SUGGESTIONS = [
  { label: "¿Dónde está ORD-1002?", prompt: "¿Dónde está mi pedido ORD-1002?" },
  { label: "Estado ORD-1001", prompt: "¿Cuál es el estado de ORD-1001?" },
  { label: "Cancelar ORD-1004", prompt: "Quiero cancelar ORD-1004" },
  { label: "Prueba Pizza 🍕", prompt: "Dame una receta para hacer una pizza" },
  { label: "Sin ID (Dato faltante)", prompt: "Quiero rastrear mi paquete" }
];

const renderFormattedContent = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={lIdx} className="block min-h-[1.25rem]">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return (
              <strong key={pIdx} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </span>
    );
  });
};

export default function ChatWidget({ onOrderUpdated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual oficial de NovaMart. Puedo ayudarte a consultar el estatus, rastrear o gestionar la cancelación de tus pedidos. ¿En qué orden te puedo colaborar hoy?'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, thinking, isOpen]);

  const sendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || thinking) return;

    const userMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setThinking(true);

    try {
      // Formatear historial para el backend
      const payloadHistory = newHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: payloadHistory
        })
      });

      if (!res.ok) {
        throw new Error(`Error en el servidor: ${res.status}`);
      }

      const data = await res.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.reply,
        toolCalled: data.tool_called,
        inferenceSource: data.inference_source
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Si la respuesta implicó una cancelación o cambio de orden, actualizamos la tabla
      if (data.order_updated && onOrderUpdated) {
        onOrderUpdated(data.order_updated);
      }

    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'No fue posible conectar con el servidor de FastAPI en http://localhost:8000. Por favor verifica que el backend esté ejecutándose.',
          isError: true 
        }
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Ventana del Chatbot */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-sky-700 rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-tight">NovaMart Assistant</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-sky-100">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>NVIDIA NIM / Guardrails Activo</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sugerencias Rápidas para la Demostración de Rúbrica */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Demo:</span>
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => sendMessage(sug.prompt)}
                disabled={thinking}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-600 text-[11px] font-medium transition-all shadow-2xs disabled:opacity-50"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                    isUser 
                      ? 'bg-slate-800 text-white' 
                      : msg.isError 
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-sky-600 text-white'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-xs'
                      : msg.isError
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}>
                    <div className="space-y-1">{renderFormattedContent(msg.content)}</div>

                    {/* Metadata de Tool (si aplica) */}
                    {msg.toolCalled && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">Tool: {msg.toolCalled}</span>
                        {msg.inferenceSource && (
                          <span className="text-sky-600 font-medium capitalize">{msg.inferenceSource}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Indicador de "Pensando..." */}
            {thinking && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-sky-600 font-semibold">NovaMart Bot está pensando</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-3 py-1.5 border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta (ej: ORD-1001)..."
                disabled={thinking}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-1.5 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || thinking}
                className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 transition-colors disabled:opacity-30 disabled:hover:bg-sky-600 shrink-0"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 mt-1.5">
              <span>Shift+Enter para salto de línea</span>
              <span>Guardrails NovaMart v1.0</span>
            </div>
          </div>

        </div>
      )}

      {/* Botón Flotante para Abrir / Cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold shadow-xl shadow-sky-600/30 hover:shadow-sky-600/50 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 transition-transform group-hover:rotate-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-sky-600 animate-pulse" />
        </div>
        <span className="text-sm tracking-tight">{isOpen ? 'Ocultar Chat' : 'Atención NovaMart'}</span>
      </button>

    </div>
  );
}

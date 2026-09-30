import React from 'react';
import { ShieldCheck, Zap, Bot, ArrowRight, CheckCircle2, Video } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge de Proyecto */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-6 border border-sky-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Arquitectura BFF Desacoplada con NVIDIA NIM</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            E-Commerce Inteligente con <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Gobernanza de IA</span>
          </h1>

          {/* Subtítulo */}
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Bienvenido a <strong>NovaMart</strong>. Explora nuestro catálogo de tecnología y monitorea en tiempo real el ciclo de vida de tus órdenes mediante el <strong>Chatbot Asistente con Guardrails Estrictos</strong>.
          </p>

          {/* Botones de Acción */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#pedidos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold text-sm shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-all active:scale-95"
            >
              <span>Ver Pedidos Activos</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm hover:bg-slate-50 transition-all"
            >
              <span>Explorar Catálogo</span>
            </a>
            <a
              href="https://youtu.be/q-2JvYxbiRQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-sm shadow-xs hover:bg-rose-100 transition-all active:scale-95"
            >
              <Video className="w-4 h-4 text-rose-600" />
              <span>Ver Video Demo</span>
            </a>
          </div>

          {/* Pilares Clave de la Rúbrica */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200/80 text-left">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-slate-200 shadow-xs">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Filtro Anti-Desvío</h4>
                <p className="text-xs text-slate-500 mt-0.5">Rechaza de inmediato solicitudes ajenas (recetas, pizza, poemas).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-slate-200 shadow-xs">
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Flujo en 2 Fases</h4>
                <p className="text-xs text-slate-500 mt-0.5">Advertencia irreversible y confirmación explícita para cancelar.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-slate-200 shadow-xs">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zero API Key Leaks</h4>
                <p className="text-xs text-slate-500 mt-0.5">Credenciales protegidas en backend/.env bajo estricto .gitignore.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

export default function Navbar() {
  const [apiOnline, setApiOnline] = useState(false);
  const [modelName, setModelName] = useState('NVIDIA NIM');

  const checkHealth = async () => {
    try {
      const res = await fetch('http://localhost:8000/');
      if (res.ok) {
        const data = await res.json();
        setApiOnline(true);
        if (data.model) setModelName(data.model.split('/').pop());
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo de Marca */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Nova<span className="text-sky-600">Mart</span></span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Bootcamp SKALA - Semana 3</p>
          </div>
        </div>

        {/* Links de Navegación */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#catalogo" className="hover:text-sky-600 transition-colors">Catálogo</a>
          <a href="#pedidos" className="hover:text-sky-600 transition-colors">Gestión de Pedidos</a>
          <a href="#arquitectura" className="hover:text-sky-600 transition-colors">Gobernanza & NIM</a>
        </nav>

        {/* Indicador de Estado del Backend y NIM */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            apiOnline 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-semibold">{apiOnline ? 'FastAPI :8000 Online' : 'FastAPI Desconectado'}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>NVIDIA NIM</span>
          </div>
        </div>

      </div>
    </header>
  );
}

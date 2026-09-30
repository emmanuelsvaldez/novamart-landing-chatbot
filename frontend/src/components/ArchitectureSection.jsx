import React from 'react';
import { Server, Cloud, Cpu, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section id="arquitectura" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            Marco Conceptual & Rúbrica
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Arquitectura Enterprise NovaMart
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Desglose técnico de los 4 conceptos fundamentales evaluados por el M. C. Fernando Morquecho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Aplicación Local */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-sky-300 transition-all shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <Server className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Concepto 1</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Aplicación Local</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed flex-1">
              Compuesta por el frontend en <strong>React + Vite (:5173)</strong> y el BFF en <strong>FastAPI (:8000)</strong>. Alberga la lógica de negocio, middleware CORS, base de datos en memoria y guardrails deterministas.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              localhost:5173 / localhost:8000
            </div>
          </div>

          {/* 2. NVIDIA NIM */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Concepto 2</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">NVIDIA NIM</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed flex-1">
              Microservicio de inferencia de <strong>NVIDIA (Inference Microservice)</strong> servido en la nube en <code>integrate.api.nvidia.com</code>. Provee contenedores y endpoints optimizados con aceleración GPU (TensorRT-LLM).
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              https://integrate.api.nvidia.com/v1
            </div>
          </div>

          {/* 3. El LLM */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Concepto 3</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">El LLM (Cerebro)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed flex-1">
              Red neuronal fundacional (familia <strong>Nemotron / Llama-3.1-70B</strong>) que realiza comprensión semántica de intenciones humanas y sintetiza respuestas profesionales bajo el prompt de sistema inyectado.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              meta/llama-3.1-70b-instruct
            </div>
          </div>

          {/* 4. Seguridad y Cero Leaks */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-rose-300 transition-all shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Concepto 4</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Gobernanza y Seguridad</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed flex-1">
              Las llaves de API <strong>nunca se exponen en el navegador</strong>. Viven encapsuladas en <code>backend/.env</code> excluidas por <code>.gitignore</code>. El frontend solo interactúa mediante el BFF local.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              .gitignore / 100% Blindado
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

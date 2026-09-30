import React from 'react';
import { Laptop, Headphones, Monitor, Keyboard, Star, ShoppingCart } from 'lucide-react';

const PRODUCTS = [
  {
    id: "PROD-1",
    name: "Laptop NovaBook Pro 15",
    category: "Laptops & Cómputo",
    price: "$1,299.99",
    rating: 4.9,
    icon: Laptop,
    badge: "En Preparación (ORD-1001)",
    desc: "Procesador Intel i7 14th Gen, 32GB RAM, 1TB SSD NVMe y pantalla OLED 120Hz."
  },
  {
    id: "PROD-2",
    name: "Audífonos NovaBeats ANC",
    category: "Audio de Alta Fidelidad",
    price: "$189.50",
    rating: 4.8,
    icon: Headphones,
    badge: "En Tránsito (ORD-1002)",
    desc: "Cancelación activa de ruido híbrida de 45dB, audio espacial y 40h de batería."
  },
  {
    id: "PROD-3",
    name: 'Monitor UltraNova 27" 4K',
    category: "Monitores & Displays",
    price: "$420.00",
    rating: 5.0,
    icon: Monitor,
    badge: "Entregado (ORD-1003)",
    desc: "Panel IPS 4K HDR 600, 144Hz, 1ms, cobertura 99% DCI-P3 y puerto USB-C 90W."
  },
  {
    id: "PROD-4",
    name: "Teclado RGB NovaStrike Pro",
    category: "Periféricos Gaming",
    price: "$79.99",
    rating: 4.7,
    icon: Keyboard,
    badge: "Pendiente Pago (ORD-1004)",
    desc: "Switches mecánicos lubricados hot-swap, keycaps PBT doble inyección y chasis de aluminio."
  }
];

export default function ProductCatalog() {
  return (
    <section id="catalogo" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
              Catálogo Oficial
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Productos Destacados de NovaMart
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Cada producto está vinculado a pedidos simulados en memoria para verificar estatus, ubicación y cancelaciones.
            </p>
          </div>
          <span className="text-xs text-slate-400 mt-2 md:mt-0 font-medium">
            4 artículos en stock demostrativo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((prod) => {
            const IconComponent = prod.icon;
            return (
              <div 
                key={prod.id}
                className="group relative flex flex-col bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300"
              >
                <div className="w-full h-36 bg-gradient-to-tr from-slate-200/60 to-sky-100/50 rounded-xl flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="w-16 h-16 text-sky-600" />
                </div>

                <div className="mt-4 flex-1 flex flex-col">
                  <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider">
                    {prod.category}
                  </span>
                  
                  <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
                    {prod.name}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 flex-1">
                    {prod.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Precio</span>
                      <span className="text-lg font-black text-slate-900">{prod.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                        {prod.badge.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

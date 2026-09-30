import React from 'react';
import { Package, RefreshCw, RotateCcw, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function OrdersTable({ orders, loading, onRefresh, onReset }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'En preparación':
        return {
          icon: Clock,
          color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20'
        };
      case 'En tránsito':
        return {
          icon: Truck,
          color: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20'
        };
      case 'Entregado':
        return {
          icon: CheckCircle2,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20'
        };
      case 'Pendiente de pago':
        return {
          icon: AlertCircle,
          color: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20'
        };
      case 'Cancelado':
        return {
          icon: XCircle,
          color: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20'
        };
      default:
        return {
          icon: Package,
          color: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20'
        };
    }
  };

  return (
    <section id="pedidos" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de la Sección */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Dashboard Operativo
              </span>
              <span className="text-xs text-slate-400 font-medium">GET /api/orders</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Tabla Reactiva de Pedidos NovaMart
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Estado en memoria sincronizado en tiempo real con las acciones del Chatbot Asistente.
            </p>
          </div>

          {/* Botones de Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Refrescar lista desde FastAPI"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>

            <button
              onClick={onReset}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Restaurar pedidos ORD-1001 a 1004 a su estado original"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Reiniciar Demo</span>
            </button>
          </div>
        </div>

        {/* Contenedor de la Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">ID Pedido</th>
                  <th scope="col" className="px-6 py-4">Cliente</th>
                  <th scope="col" className="px-6 py-4">Producto</th>
                  <th scope="col" className="px-6 py-4">Estatus Actual</th>
                  <th scope="col" className="px-6 py-4">Ubicación Logística</th>
                  <th scope="col" className="px-6 py-4">Total</th>
                  <th scope="col" className="px-6 py-4 text-center">¿Cancelable?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-sm">
                      {loading ? 'Cargando pedidos de NovaMart...' : 'No se encontraron pedidos en memoria.'}
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => {
                    const badge = getStatusBadge(ord.status);
                    const IconComp = badge.icon;
                    return (
                      <tr 
                        key={ord.order_id} 
                        className={`hover:bg-slate-50/80 transition-colors ${ord.status === 'Cancelado' ? 'bg-rose-50/20' : ''}`}
                      >
                        {/* ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                            {ord.order_id}
                          </span>
                        </td>

                        {/* Cliente */}
                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                          {ord.customer || 'Cliente NovaMart'}
                        </td>

                        {/* Producto */}
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                          {ord.product || 'Artículo'}
                        </td>

                        {/* Estatus */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ring-1 ${badge.color}`}>
                            <IconComp className="w-3.5 h-3.5" />
                            <span>{ord.status}</span>
                          </span>
                        </td>

                        {/* Ubicación */}
                        <td className="px-6 py-4 text-slate-600 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{ord.location}</span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                          ${typeof ord.total === 'number' ? ord.total.toFixed(2) : ord.total}
                        </td>

                        {/* Cancelable */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            ord.can_cancel 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {ord.can_cancel ? 'Sí' : 'No'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Mostrando {orders.length} pedidos en memoria simulada.</span>
            <span className="font-mono text-[11px] text-slate-400">Endpoint BFF: http://localhost:8000/api/orders</span>
          </div>
        </div>

      </div>
    </section>
  );
}

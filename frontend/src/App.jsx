import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import OrdersTable from './components/OrdersTable';
import ArchitectureSection from './components/ArchitectureSection';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener pedidos desde el backend de FastAPI
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error al consultar /api/orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar base de datos de pedidos a su estado inicial
  const resetOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/orders/reset', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error al reiniciar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial al montar la aplicación
  useEffect(() => {
    fetchOrders();
  }, []);

  // Actualización reactiva instantánea al recibir confirmación de cancelación en el chatbot
  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.order_id === updatedOrder.order_id ? updatedOrder : ord))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* 1. Barra de Navegación */}
      <Navbar />

      {/* 2. Sección Hero */}
      <Hero />

      {/* 3. Catálogo Comercial */}
      <ProductCatalog />

      {/* 4. Tabla Reactiva de Pedidos */}
      <OrdersTable 
        orders={orders} 
        loading={loading} 
        onRefresh={fetchOrders} 
        onReset={resetOrders} 
      />

      {/* 5. Marco Conceptual y Rúbrica */}
      <ArchitectureSection />

      {/* 6. Footer Corporativo */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-200">
            NovaMart E-Commerce AI Suite &copy; 2026. Bootcamp SKALA - Semana 3.
          </p>
          <p className="text-slate-500">
            Desarrollado para evaluación oficial por el M. C. Fernando Morquecho. Arquitectura BFF (FastAPI + React + NVIDIA NIM).
          </p>
        </div>
      </footer>

      {/* 7. Widget Flotante del Chatbot */}
      <ChatWidget onOrderUpdated={handleOrderUpdated} />
    </div>
  );
}

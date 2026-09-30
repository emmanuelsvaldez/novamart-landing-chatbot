from typing import Dict, Any, List, Optional
import copy

# Mock DB oficial según especificación de rúbrica
INITIAL_ORDERS: Dict[str, Dict[str, Any]] = {
    "ORD-1001": {
        "order_id": "ORD-1001",
        "customer": "Carlos Mendoza",
        "product": "Laptop NovaBook Pro 15",
        "status": "En preparación",
        "location": "Almacén NovaMart",
        "can_cancel": True,
        "total": 1299.99,
        "date": "2026-09-29"
    },
    "ORD-1002": {
        "order_id": "ORD-1002",
        "customer": "María Fernanda López",
        "product": "Audífonos Noise Cancelling NovaBeats",
        "status": "En tránsito",
        "location": "Centro de distribución Tijuana",
        "can_cancel": False,
        "total": 189.50,
        "date": "2026-09-28"
    },
    "ORD-1003": {
        "order_id": "ORD-1003",
        "customer": "Alejandro Ruiz",
        "product": 'Monitor Gamer 27" 4K UltraNova',
        "status": "Entregado",
        "location": "Entregado al cliente",
        "can_cancel": False,
        "total": 420.00,
        "date": "2026-09-27"
    },
    "ORD-1004": {
        "order_id": "ORD-1004",
        "customer": "Laura Gómez",
        "product": "Teclado Mecánico RGB NovaStrike",
        "status": "Pendiente de pago",
        "location": "Sin envío",
        "can_cancel": True,
        "total": 79.99,
        "date": "2026-09-29"
    }
}

# Repositorio en memoria con estado mutable durante la sesión
ORDERS_DB: Dict[str, Dict[str, Any]] = copy.deepcopy(INITIAL_ORDERS)

def get_all_orders() -> List[Dict[str, Any]]:
    """Retorna la lista completa de pedidos en memoria."""
    return list(ORDERS_DB.values())

def get_order_by_id(order_id: str) -> Optional[Dict[str, Any]]:
    """Busca un pedido por su identificador normalizado (ej: ORD-1001)."""
    clean_id = order_id.strip().upper()
    return ORDERS_DB.get(clean_id)

def cancel_order_in_db(order_id: str) -> Optional[Dict[str, Any]]:
    """Modifica el pedido en memoria a estado Cancelado."""
    clean_id = order_id.strip().upper()
    if clean_id in ORDERS_DB:
        order = ORDERS_DB[clean_id]
        order["status"] = "Cancelado"
        order["location"] = "Cancelado por el cliente"
        order["can_cancel"] = False
        return copy.deepcopy(order)
    return None

def reset_orders_db() -> List[Dict[str, Any]]:
    """Reinicia la base de datos simulada a su estado original para pruebas."""
    global ORDERS_DB
    ORDERS_DB = copy.deepcopy(INITIAL_ORDERS)
    return list(ORDERS_DB.values())

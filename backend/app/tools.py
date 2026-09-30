from typing import Dict, Any, Tuple
from app.database import get_order_by_id, cancel_order_in_db

def consultar_pedido(order_id: str) -> Tuple[bool, str, Dict[str, Any] | None]:
    """
    Herramienta para consultar el estado general de un pedido.
    Retorna (éxito, mensaje_descriptivo, datos_pedido).
    """
    order = get_order_by_id(order_id)
    if not order:
        return (
            False,
            f"No encontré ningún pedido con el número {order_id.upper()}. Por favor verifica que el formato sea correcto (ejemplo: ORD-1001).",
            None
        )
    
    status = order["status"]
    location = order["location"]
    product = order.get("product", "Artículo")
    
    if status == "En preparación":
        msg = f"Tu pedido {order['order_id']} ({product}) está actualmente 'En preparación' en {location} y aún no cuenta con guía de envío asignada."
    elif status == "En tránsito":
        msg = f"Tu pedido {order['order_id']} ({product}) se encuentra 'En tránsito'. Ubicación actual: {location}."
    elif status == "Entregado":
        msg = f"Tu pedido {order['order_id']} ({product}) figura como 'Entregado' ({location})."
    elif status == "Pendiente de pago":
        msg = f"Tu pedido {order['order_id']} ({product}) está en estado 'Pendiente de pago'. Ubicación: {location}."
    elif status == "Cancelado":
        msg = f"Tu pedido {order['order_id']} fue cancelado previamente ({location})."
    else:
        msg = f"El pedido {order['order_id']} se encuentra en estado '{status}' con ubicación: {location}."
        
    return True, msg, order

def rastrear_pedido(order_id: str) -> Tuple[bool, str, Dict[str, Any] | None]:
    """
    Herramienta especializada en rastreo y geolocalización de un paquete.
    """
    order = get_order_by_id(order_id)
    if not order:
        return (
            False,
            f"No se encontró el pedido {order_id.upper()} para rastreo en nuestro sistema logístico.",
            None
        )
    
    location = order["location"]
    status = order["status"]
    
    if status == "En preparación":
        msg = f"El pedido {order['order_id']} se encuentra en el {location}. Todavía no sale a ruta hacia tu domicilio."
    elif status == "En tránsito":
        msg = f"Rastreo en tiempo real: El pedido {order['order_id']} está en ruta y fue registrado recientemente en: {location}."
    elif status == "Entregado":
        msg = f"El pedido {order['order_id']} ya fue entregado exitosamente al cliente en su domicilio."
    elif status == "Cancelado":
        msg = f"El pedido {order['order_id']} está cancelado y no tiene movimientos logísticos activos."
    else:
        msg = f"Estado logístico de {order['order_id']}: {status}. Ubicación actual: {location}."
        
    return True, msg, order

def validar_cancelacion(order_id: str) -> Tuple[bool, bool, str, Dict[str, Any] | None]:
    """
    Valida si un pedido cumple con las reglas de negocio para ser cancelado.
    Retorna (pedido_existe, es_cancelable, mensaje_explicativo, datos_pedido).
    """
    order = get_order_by_id(order_id)
    if not order:
        return (
            False,
            False,
            f"El pedido {order_id.upper()} no existe en el sistema.",
            None
        )
    
    if order["status"] == "Cancelado":
        return (
            True,
            False,
            f"El pedido {order['order_id']} ya se encuentra cancelado.",
            order
        )
        
    if not order["can_cancel"]:
        status = order["status"]
        if status == "En tránsito":
            msg = (
                f"El pedido {order['order_id']} no puede ser cancelado porque ya se encuentra 'En tránsito' "
                f"en {order['location']}. Una vez que el transportista tiene el paquete, debes esperar la entrega "
                f"y solicitar una devolución en sucursal o en línea."
            )
        elif status == "Entregado":
            msg = (
                f"El pedido {order['order_id']} no puede ser cancelado debido a que ya fue 'Entregado al cliente'. "
                f"Si requieres una devolución o cambio, por favor gestiona tu garantía."
            )
        else:
            msg = f"El pedido {order['order_id']} no es elegible para cancelación en su estado actual ({status})."
        return True, False, msg, order
        
    msg = (
        f"El pedido {order['order_id']} ({order['product']}) se encuentra '{order['status']}' y SÍ permite cancelación. "
        f"Ten en cuenta que esta acción es definitiva e irreversible. ¿Deseas cancelarlo? (Responde 'sí' o 'no')."
    )
    return True, True, msg, order

def ejecutar_cancelacion(order_id: str) -> Tuple[bool, str, Dict[str, Any] | None]:
    """
    Ejecuta efectivamente la cancelación en la base de datos tras confirmación del usuario.
    """
    valid_exists, can_cancel, val_msg, order = validar_cancelacion(order_id)
    if not valid_exists:
        return False, val_msg, None
    if not can_cancel:
        return False, val_msg, order
        
    updated = cancel_order_in_db(order_id)
    msg = f"✅ Tu pedido {order_id.upper()} ha sido cancelado con éxito. Hemos detenido el proceso y el estatus se ha actualizado en el sistema."
    return True, msg, updated

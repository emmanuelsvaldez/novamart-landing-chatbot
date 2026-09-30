import sys
sys.stdout.reconfigure(encoding='utf-8')
from starlette.testclient import TestClient
from app.main import app
from app.guardrails import OFF_TOPIC_RESPONSE

client = TestClient(app)

def run_tests():
    print("--- INICIANDO BATERIA DE PRUEBAS DE RUBRICA (NVIDIA NIM) ---")
    
    # 1. GET /api/orders
    r = client.get("/api/orders")
    assert r.status_code == 200, f"Error en GET /api/orders: {r.status_code}"
    orders = r.json()
    print(f"[OK] GET /api/orders exitoso: {len(orders)} pedidos recuperados.")
    assert any(o["order_id"] == "ORD-1001" for o in orders)
    
    # 2. Caso 1: Estatus ORD-1001
    r = client.post("/api/chat", json={"message": "¿Cuál es el estado de ORD-1001?", "history": []})
    assert r.status_code == 200
    res = r.json()
    print(f"[OK] Caso 1 (ORD-1001): {res['reply']} | Source: {res['inference_source']}")
    assert any(w in res["reply"].lower() for w in ["preparación", "preparacion", "almacén", "almacen"])
    
    # 3. Caso 2: Rastrear ORD-1002
    r = client.post("/api/chat", json={"message": "¿Dónde está mi pedido ORD-1002?", "history": []})
    assert r.status_code == 200
    res = r.json()
    print(f"[OK] Caso 2 (ORD-1002): {res['reply']} | Source: {res['inference_source']}")
    assert "tijuana" in res["reply"].lower()
    
    # 4. Caso 3: Cancelar ORD-1002 (no cancelable)
    r = client.post("/api/chat", json={"message": "Quiero cancelar el pedido ORD-1002", "history": []})
    assert r.status_code == 200
    res = r.json()
    print(f"[OK] Caso 3.1 (ORD-1002 no cancelable): {res['reply']} | Source: {res['inference_source']}")
    assert any(w in res["reply"].lower() for w in ["no puede", "no es posible", "no se puede", "devolución", "devolucion"])
    
    # 5. Caso 4: Cancelar ORD-1004 (flujo en 2 pasos)
    r1 = client.post("/api/chat", json={"message": "Quiero cancelar ORD-1004", "history": []})
    assert r1.status_code == 200
    res1 = r1.json()
    print(f"[OK] Caso 4.1 (Petición de confirmación ORD-1004): {res1['reply']}")
    assert any(w in res1["reply"].lower() for w in ["irreversible", "cancelar", "¿deseas", "deseas"])
    
    # Confirmar con "sí"
    hist = [
        {"role": "user", "content": "Quiero cancelar ORD-1004"},
        {"role": "assistant", "content": res1["reply"]}
    ]
    r2 = client.post("/api/chat", json={"message": "Sí, confirmo la cancelación", "history": hist})
    assert r2.status_code == 200
    res2 = r2.json()
    print(f"[OK] Caso 4.2 (Confirmación ejecutada): {res2['reply']} | Tool: {res2['tool_called']}")
    assert res2["order_updated"] is not None
    assert res2["order_updated"]["status"] == "Cancelado"
    
    # 6. Caso 5: Fuera de tema (Filtro anti-desvío estricto)
    r = client.post("/api/chat", json={"message": "Dime la receta para hacer una pizza", "history": []})
    assert r.status_code == 200
    res = r.json()
    print(f"[OK] Caso 5.1 (Pizza rechazada): {res['reply']}")
    assert res["reply"] == OFF_TOPIC_RESPONSE
    
    r = client.post("/api/chat", json={"message": "Escribe un poema sobre el cielo", "history": []})
    assert r.status_code == 200
    res = r.json()
    print(f"[OK] Caso 5.2 (Poema rechazado): {res['reply']}")
    assert res["reply"] == OFF_TOPIC_RESPONSE
    
    # 7. Caso 6: Dato faltante (sin ORD-####)
    r = client.post("/api/chat", json={"message": "Quiero rastrear mi paquete", "history": []})
    assert r.status_code == 200
    res = r.json()
    print(f"[OK] Caso 6 (Dato faltante): {res['reply']}")
    assert "ORD-####" in res["reply"]
    
    print("\nTODAS LAS PRUEBAS DE RUBRICA CON NVIDIA NIM PASARON AL 100%!")

if __name__ == "__main__":
    run_tests()

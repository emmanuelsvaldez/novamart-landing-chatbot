# 🏛️ Documento de Arquitectura Técnica: NovaMart AI Suite

> **Bootcamp SKALA - Inteligencia Artificial & Agentes Enterprise (Semana 3)**  
> **Patrón Arquitectónico:** BFF (Backend for Frontend) Desacoplado  
> **Inferencia:** NVIDIA NIM Cloud Runtime (`nvidia/nemotron-3-ultra-550b-a55b`)  
> **Video Demostrativo:** https://youtu.be/q-2JvYxbiRQ

---

## 1. Justificación del Patrón Arquitectónico (BFF)

Para garantizar la estabilidad requerida en una demostración en vivo de alta exigencia, se adoptó un patrón **BFF (Backend for Frontend)** desacoplado ejecutado localmente:

1. **Eliminación de Latencia y Cold Starts:** Evita el despliegue en plataformas serverless gratuitas (como Vercel o Render) que introducen retrasos imprevistos por hibernación de contenedores.
2. **Cero Problemas de CORS:** El middleware CORS en FastAPI está parametrizado de forma transparente para interactuar directamente con `http://localhost:5173`.
3. **Encapsulamiento de Secretos:** La llave `NVIDIA_API_KEY` reside exclusivamente en el BFF. Ningún token ni header de autenticación se expone al cliente del navegador.
4. **Gobernanza Determinista Previa:** Antes de enviar un solo prompt a NVIDIA NIM, el BFF procesa y valida la intención mediante filtros deterministas, ahorrando consumo innecesario de inferencia y asegurando un comportamiento predecible.

---

## 2. Diagrama de Arquitectura Completo

```
+-----------------------------------------------------------------------------------+
|                        CAPA DE PRESENTACIÓN: REACT + VITE :5173                   |
|  - Navbar: Monitoreo en vivo del servidor (:8000 Online / Offline)               |
|  - Hero: Identidad de marca NovaMart y acceso al video demostrativo               |
|  - ProductCatalog: Catálogo comercial conectado a las órdenes                     |
|  - OrdersTable: Tabla reactiva sincronizada en tiempo real                        |
|  - ArchitectureSection: Desglose visual de los 4 conceptos de evaluación          |
|  - ChatWidget: Widget flotante interactivo con formateador Markdown               |
+------------------------------------------+----------------------------------------+
                                           |
                                           | HTTP REST / JSON (CORS Habilitado)
                                           v
+-----------------------------------------------------------------------------------+
|                         CAPA BFF: FASTAPI EN PUERTO 8000                          |
|  - CORS Middleware: Permitir localhost:5173                                      |
|  - Guardrails Anti-Desvío: Bloqueo estricto de poemas, pizzas y temas ajenos      |
|  - Detector de Identificador: Extracción y validación regex ORD-####             |
|  - Flujo de Cancelación en 2 Fases: Confirmación explícita irreversible           |
|  - Módulo de Herramientas: consultar_pedido, rastrear_pedido, validar, cancelar  |
|  - Base de Datos Simulada en Memoria (ORD-1001 a ORD-1004)                        |
|  - Adaptador Thread-Safe para NVIDIA NIM (OpenAI SDK Client)                      |
+------------------------------------------+----------------------------------------+
                                           |
                                           | TLS / HTTPS (integrate.api.nvidia.com)
                                           v
+-----------------------------------------------------------------------------------+
|                     MICROSERVICIO DE INFERENCIA: NVIDIA NIM                       |
|  - Modelo: nvidia/nemotron-3-ultra-550b-a55b                                      |
|  - Aceleración: TensorRT-LLM en clúster de GPUs NVIDIA                            |
+-----------------------------------------------------------------------------------+
```

---

## 3. Contratos de API (JSON Schemas)

### 3.1 `GET /api/orders`
Retorna el estado actual de los pedidos en memoria:
```json
[
  {
    "order_id": "ORD-1001",
    "customer": "Carlos Mendoza",
    "product": "Laptop NovaBook Pro 15",
    "status": "En preparación",
    "location": "Almacén NovaMart",
    "can_cancel": true,
    "total": 1299.99
  }
]
```

### 3.2 `POST /api/chat`
Procesa la consulta del cliente:
```json
// Request
{
  "message": "¿Dónde está mi pedido ORD-1002?",
  "history": []
}

// Response
{
  "reply": "Tu pedido ORD-1002 está en ruta y fue registrado recientemente en el Centro de distribución Tijuana.",
  "tool_called": "rastrear_pedido",
  "order_updated": null,
  "inference_source": "nvidia_nim"
}
```

### 3.3 `POST /api/orders/reset`
Reinicia los pedidos al estado inicial para repetir pruebas de rúbrica.

---

## 4. Políticas de Seguridad y Blindaje de Credenciales

- `.gitignore` estricto en la raíz que omite `.env`, `.env.*`, `node_modules/`, `venv/`, `dist/`.
- Repositorio listo para ser publicado en GitHub con cero riesgo de filtración de claves.

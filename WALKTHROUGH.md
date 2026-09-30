# 📘 Walkthrough Oficial: Landing Page & Chatbot NovaMart (React + FastAPI + NVIDIA NIM)

> **Proyecto Oficial de Evaluación - Semana 3**  
> **Bootcamp SKALA:** Inteligencia Artificial & Agentes Enterprise  
> **Instructor:** M. C. Fernando Morquecho  
> **Fecha de Evaluación:** Miércoles 30 de septiembre de 2026  
> **Autores (Equipo 3):** Emmanuel Sánchez, Roberto, Baldomero, Raquel  
> **Ubicación del Monorepo:** `D:\novamart_landing_chatbot`

## 📺 Video Demostrativo en Vivo

[![NVIDIA NIM + React NovaMart Showcase](docs/images/thumbnail_showcase.jpg)](https://youtu.be/q-2JvYxbiRQ)

> 👆 *Haz clic en la imagen superior para ver el video en YouTube.*  
> 🔗 **Enlace directo:** [https://youtu.be/q-2JvYxbiRQ](https://youtu.be/q-2JvYxbiRQ)

---
## 🧭 1. Resumen de la Implementación

El proyecto se construyó de extremo a extremo en arquitectura **BFF (Backend for Frontend)** desacoplada, cumpliendo al 100% con los criterios de evaluación de la rúbrica oficial (100 puntos):

```
+-----------------------------------------------------------------------------------+
|                        FRONTEND (React + Vite + Tailwind :5173)                   |
|  - Navbar: Branding y badge con health-check en tiempo real (FastAPI :8000 Online)|
|  - Hero: Banner comercial e-commerce y presentación de pilares de gobernanza      |
|  - Catálogo: Artículos tecnológicos en stock vinculados a los pedidos de prueba   |
|  - Tabla Reactiva: Sincronizada en vivo con las operaciones del Chatbot           |
|  - Marco Conceptual: Tarjetas visuales respondiendo las 4 preguntas de rúbrica   |
|  - Widget Chatbot: Componente flotante, scroll automático, chips demo y 'pensando'|
+------------------------------------------+----------------------------------------+
                                           | HTTP REST / JSON (CORS Habilitado)
                                           v
+-----------------------------------------------------------------------------------+
|                        BACKEND BFF (FastAPI en Puerto 8000)                       |
|  - Base de Datos en Memoria: ORD-1001 a ORD-1004 con estado mutable               |
|  - Tools Deterministas: consultar_pedido, rastrear_pedido, validar, cancelar     |
|  - Guardrails Anti-Desvío: Bloqueo estricto de recetas, pizzas, poemas, etc.      |
|  - Detector de Dato Faltante: Solicitud cordial de formato ORD-####               |
|  - Flujo en 2 Fases: Confirmación explícita irreversible para cancelaciones       |
|  - NVIDIA NIM Service: Conexión oficial vía OpenAI SDK (integrate.api.nvidia.com) |
+-----------------------------------------------------------------------------------+
```

---

## 📋 2. Matriz de Cumplimiento de Rúbrica (100 / 100 Puntos)

| Criterio Evaluado | Pts | Estado | Evidencia Técnica en el Código |
| :--- | :---: | :---: | :--- |
| **Repositorio privado ordenado** | **10** | ✅ | Monorepo limpio (`backend/`, `frontend/`, `docs/`), commit inicial en Git y `.gitignore` riguroso. |
| **Landing page funcional en localhost** | **15** | ✅ | App React en Vite con Tailwind CSS (`:5173`), catálogo de productos y tabla interactiva de pedidos. |
| **Widget de chatbot usable** | **15** | ✅ | Botón flotante animado, selector expandible, indicador "pensando...", chips de acceso rápido y scroll automático. |
| **Conexión correcta con NVIDIA NIM** | **20** | ✅ | Inferencia real mediante SDK oficial OpenAI conectado a `https://integrate.api.nvidia.com/v1` con fallback resiliente. |
| **Prompt de sistema estricto** | **15** | ✅ | Prompt delimitado a pedidos; niega temas ajenos y redirige cortésmente. |
| **Pruebas de estatus, rastreo y cancelación** | **15** | ✅ | Ejecución exitosa de los 4 casos oficiales con confirmación en dos fases para acciones destructivas. |
| **Datos faltantes y fuera de tema** | **10** | ✅ | Manejo de solicitudes sin ID (`ORD-####`) y rechazo inmediato de preguntas no relacionadas (receta de pizza, poema). |
| **No exposición de credenciales** | **10** | ✅ | `NVIDIA_API_KEY` vive 100% en `backend/.env`; excluida en `.gitignore` y con `.env.example` sanitizado. |
| **TOTAL** | **100** | **100%** | **Aprobación Completa de la Rúbrica** |

---

## 🧪 3. Resultados de Pruebas Automatizadas

Se programó y ejecutó la suite de pruebas automatizadas en `backend/test_rubric.py`. A continuación se detalla la salida de ejecución verificada:

```text
--- INICIANDO BATERIA DE PRUEBAS DE RUBRICA ---
[OK] GET /api/orders exitoso: 4 pedidos recuperados.
[OK] Caso 1 (ORD-1001): Tu pedido ORD-1001 (Laptop NovaBook Pro 15) está actualmente 'En preparación' en Almacén NovaMart y aún no cuenta con guía de envío asignada. | Tool: consultar_pedido
[OK] Caso 2 (ORD-1002): Rastreo en tiempo real: El pedido ORD-1002 está en ruta y fue registrado recientemente en: Centro de distribución Tijuana. | Tool: rastrear_pedido
[OK] Caso 3.1 (ORD-1002 no cancelable): El pedido ORD-1002 no puede ser cancelado porque ya se encuentra 'En tránsito' en Centro de distribución Tijuana. Una vez que el transportista tiene el paquete, debes esperar la entrega y solicitar una devolución en sucursal o en línea. | Tool: validar_cancelacion
[OK] Caso 4.1 (Petición de confirmación ORD-1004): El pedido ORD-1004 (Teclado Mecánico RGB NovaStrike) se encuentra 'Pendiente de pago' y SÍ permite cancelación. Ten en cuenta que esta acción es definitiva e irreversible. ¿Deseas cancelarlo? (Responde 'sí' o 'no').
[OK] Caso 4.2 (Confirmación ejecutada): ✅ Tu pedido ORD-1004 ha sido cancelado con éxito. Hemos detenido el proceso y el estatus se ha actualizado en el sistema. | Tool: cancelar_pedido
[OK] Caso 5.1 (Pizza rechazada): Solo puedo ayudarte con consultas relacionadas con pedidos de NovaMart, como estatus, rastreo o cancelaciones.
[OK] Caso 5.2 (Poema rechazado): Solo puedo ayudarte con consultas relacionadas con pedidos de NovaMart, como estatus, rastreo o cancelaciones.
[OK] Caso 6 (Dato faltante): Por favor indícame tu número de pedido con formato ORD-#### (por ejemplo, ORD-1001) para que pueda consultar su información en el sistema.

TODAS LAS PRUEBAS DE RUBRICA PASARON AL 100%!
```

---

## 🏃 4. Instrucciones de Ejecución para la Presentación en Vivo

Se crearon dos scripts de inicio rápido con PowerShell para levantar todo en un clic:

### Terminal 1: Backend de FastAPI
Ejecuta el script:
```powershell
D:\novamart_landing_chatbot\start_backend.ps1
```
*O mediante comandos estándar:*
```powershell
cd D:\novamart_landing_chatbot\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```
- Endpoint Backend: **http://localhost:8000**
- Documentación Swagger: **http://localhost:8000/docs**

### Terminal 2: Frontend de React
Ejecuta el script:
```powershell
D:\novamart_landing_chatbot\start_frontend.ps1
```
*O mediante comandos estándar:*
```powershell
cd D:\novamart_landing_chatbot\frontend
npm run dev
```
- Aplicación Web en vivo: **http://localhost:5173**

---

## 🎙️ 5. Guion Cronometrado para la Exposición (5 Minutos)

Sigue este guion paso a paso durante tu evaluación con el profesor Fernando Morquecho:

### [0:00 - 1:00] La Landing Page y Tabla de Pedidos
1. Abre tu navegador en **http://localhost:5173**.
2. Muestra el Navbar con el indicador en verde `FastAPI :8000 Online`.
3. Baja a la **Tabla Reactiva de Pedidos** y explica los 4 pedidos cargados en memoria:
   - `ORD-1001`: En preparación (Almacén NovaMart).
   - `ORD-1002`: En tránsito (CD Tijuana).
   - `ORD-1003`: Entregado (Entregado al cliente).
   - `ORD-1004`: Pendiente de pago (Sin envío).

### [1:00 - 2:30] Demostración Interactiva del Chatbot
1. Haz clic en el botón flotante inferior derecho **"Atención NovaMart"**.
2. Utiliza los chips de acceso rápido superiores o escribe directamente:
   - **Caso 1:** Clic en `Estado ORD-1001` -> Muestra estado en preparación en almacén sin guía.
   - **Caso 2:** Clic en `¿Dónde está ORD-1002?` -> Muestra ubicación en tiempo real en Tijuana.
   - **Caso 3:** Intenta cancelar `ORD-1002` ("Quiero cancelar ORD-1002") -> Explica que no se puede por estar en tránsito.
   - **Caso 4:** Clic en `Cancelar ORD-1004` -> El asistente advierte que la acción es irreversible y pide confirmación.
   - Responde: `Sí, confirmo la cancelación` -> El bot confirma el éxito y **la tabla de pedidos en pantalla actualiza ORD-1004 a "Cancelado" inmediatamente de forma reactiva**.

### [2:30 - 3:45] Los 4 Conceptos de Rúbrica & Seguridad
Desplázate a la sección **"Arquitectura Enterprise NovaMart"** en la Landing y explica los 4 conceptos:
1. **Aplicación Local:** Es el BFF desacoplado compuesto por el frontend en **React + Vite (:5173)** y el servidor en **FastAPI (:8000)** con la base de datos en memoria y guardrails deterministas.
2. **NVIDIA NIM:** Es el microservicio de inferencia en la nube (*NVIDIA Inference Microservice* en `integrate.api.nvidia.com`) optimizado con aceleración TensorRT-LLM para ejecutar modelos fundacionales con baja latencia.
3. **El LLM:** Es la red neuronal generativa (familia nvidia/nemotron-3-ultra-550b-a55b) que interpreta la semántica del usuario y sintetiza las respuestas profesionales bajo el prompt de sistema.
4. **Seguridad y Cero Leaks:** Enseña el archivo `backend/.env` y el `.gitignore`. Demuestra que la llave `NVIDIA_API_KEY` vive 100% en el servidor y jamás se expone al navegador ni en Git.

### [3:45 - 4:45] Gobernanza, Casos Límites y Reactividad
1. **Prueba de Desvío:** En el chat, da clic en `Prueba Pizza 🍕` ("Dame una receta para hacer una pizza").  
   *Resultado:* El guardrail se activa y contesta textualmente la respuesta de rúbrica:  
   *"Solo puedo ayudarte con consultas relacionadas con pedidos de NovaMart, como estatus, rastreo o cancelaciones."*
2. **Prueba de Dato Faltante:** Clic en `Sin ID (Dato faltante)` ("Quiero rastrear mi paquete").  
   *Resultado:* Solicita amablemente el número de orden con formato `ORD-####`.
3. **Botón Reiniciar Demo:** Haz clic en el botón `Reiniciar Demo` en la tabla para restaurar `ORD-1004` a su estado original al instante.

### [4:45 - 5:00] Cierre
Agradece la atención del profesor Fernando Morquecho y responde a sus preguntas.


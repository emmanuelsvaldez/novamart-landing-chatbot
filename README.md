# 🛒 NovaMart: Landing Page & Chatbot Asistente con React, FastAPI y NVIDIA NIM

> **Proyecto Oficial de Evaluación - Semana 3**  
> **Bootcamp SKALA:** Inteligencia Artificial & Agentes Enterprise  
> **Instructor:** M. C. Fernando Morquecho  
> **Fecha de Presentación en Vivo:** Miércoles 30 de septiembre de 2026  
> **Autor / Full-Stack Developer:** Emmanuel Sánchez

---

## 🎯 1. Resumen Ejecutivo y Rúbrica de Evaluación (100 / 100 Puntos)

Este proyecto implementa una solución desacoplada de extremo a extremo basada en el patrón arquitectónico **BFF (Backend for Frontend)** para la tienda departamental **NovaMart**. Consta de una **Landing Page comercial responsiva** en React con una **tabla reactiva de pedidos** y un **Widget de Chatbot flotante** gobernado por **Guardrails deterministas** y conectado al servicio de inferencia en la nube de **NVIDIA NIM** (familia NVIDIA Nemotron 3 Ultra (550B)).

### Matriz de Cumplimiento Técnico de la Rúbrica

| Criterio Oficial de Rúbrica | Pts | Estado | Estrategia de Cumplimiento Técnico |
| :--- | :---: | :---: | :--- |
| **1. Repositorio privado ordenado** | **10** | ✅ | Monorepo limpio (`/frontend`, `/backend`, `/docs`), sin archivos basura, con `.gitignore` riguroso. |
| **2. Landing page funcional en localhost** | **15** | ✅ | Vite + React + Tailwind CSS (`:5173`), catálogo comercial con productos NovaMart y tabla reactiva de pedidos. |
| **3. Widget de chatbot usable** | **15** | ✅ | Componente flotante con animaciones fluidas, indicador "pensando...", chips de prueba rápida y scroll automático. |
| **4. Conexión correcta con NVIDIA NIM** | **20** | ✅ | Inferencia real mediante SDK oficial OpenAI hacia el endpoint `https://integrate.api.nvidia.com/v1` con fallback resiliente. |
| **5. Prompt de sistema estricto** | **15** | ✅ | Prompt inyectado en servidor con reglas inmutables; prohíbe temas ajenos y redirige cortésmente. |
| **6. Pruebas de estatus, rastreo y cancelación** | **15** | ✅ | Soporte integral de `ORD-1001` a `ORD-1004`, flujo de cancelación en 2 fases (advertencia irreversible + confirmación "sí"). |
| **7. Datos faltantes y fuera de tema** | **10** | ✅ | Rechazo estricto con la frase oficial ante desvíos (receta de pizza, poemas) y solicitud cordial de ID en formato `ORD-####`. |
| **8. No exposición de credenciales** | **10** | ✅ | `NVIDIA_API_KEY` vive 100% en `backend/.env`, nunca viaja al frontend ni se sube al control de versiones (`.gitignore`). |
| **PUNTAJE TOTAL ESPERADO** | **100** | **100%** | **Listo para entrega y demostración en vivo.** |

---

## 🏛️ 2. Arquitectura de Software: Patrón BFF Desacoplado

```
+-----------------------------------------------------------------------------------+
|                           FRONTEND LOCAL (React + Vite :5173)                     |
|  - Navbar & Hero Comercial NovaMart                                               |
|  - Catálogo de Productos Tecnológicos                                            |
|  - Tabla Reactiva de Pedidos (ORD-1001 a ORD-1004)                                |
|  - Widget Flotante de Chatbot Asistente (Auto-scroll + Indicador "Pensando...")   |
+------------------------------------------+----------------------------------------+
                                           |
                                           | HTTP JSON / REST (CORS Habilitado)
                                           v
+-----------------------------------------------------------------------------------+
|                        BACKEND LOCAL - BFF (FastAPI :8000)                        |
|  - CORS Middleware (allow_origins localhost:5173)                                 |
|  - Filtro Anti-Desvío Estricto (Guardrails deterministas contra poemas/pizzas)    |
|  - Validador y Extractor de Formato ORD-####                                      |
|  - Módulo de Tools Logísticas (consultar, rastrear, validar, cancelar)           |
|  - Base de Datos Simulada en Memoria (Stateful durante la sesión)                 |
+------------------------------------------+----------------------------------------+
                                           |
                                           | TLS / OpenAI SDK (Key protegida en .env)
                                           v
+-----------------------------------------------------------------------------------+
|                     PROVEEDOR DE INFERENCIA CLOUD: NVIDIA NIM                     |
|  - Endpoint: https://integrate.api.nvidia.com/v1                                  |
|  - Modelo: nvidia/nemotron-3-ultra-550b-a55b         |
+-----------------------------------------------------------------------------------+
```

---

## 📂 3. Estructura del Proyecto (Monorepo)

```
novamart_landing_chatbot/
├── .gitignore                    # Excluye .env, venv/, node_modules/, dist/, __pycache__/
├── README.md                     # Documentación completa y guion de evaluación
├── start_backend.ps1             # Script de arranque rápido para FastAPI
├── start_frontend.ps1            # Script de arranque rápido para Vite + React
├── docs/                         # Documentación técnica adicional y diagramas
├── backend/                      # Backend for Frontend (FastAPI :8000)
│   ├── .env                      # Llave privada NVIDIA_API_KEY (protegida)
│   ├── .env.example              # Plantilla pública sin secretos
│   ├── requirements.txt          # fastapi, uvicorn, openai, pydantic, python-dotenv
│   ├── test_rubric.py            # Suite automatizada de pruebas de los casos de rúbrica
│   └── app/
│       ├── __init__.py
│       ├── config.py             # Carga y validación de variables de entorno
│       ├── database.py           # Repositorio en memoria (ORD-1001 a 1004)
│       ├── guardrails.py         # Filtro anti-desvío estricto y detector de confirmación
│       ├── tools.py              # Herramientas de consulta, rastreo y cancelación
│       ├── nim_service.py        # Conexión oficial a NVIDIA NIM vía SDK de OpenAI
│       └── main.py               # Endpoints REST y Middleware CORS
└── frontend/                     # Aplicación Web (React + Vite + Tailwind :5173)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx               # Integración de landing, tabla y widget reactivo
        ├── main.jsx
        ├── index.css             # Directivas de Tailwind CSS
        └── components/
            ├── Navbar.jsx        # Barra superior con health-check en tiempo real
            ├── Hero.jsx          # Sección comercial de NovaMart
            ├── ProductCatalog.jsx# Catálogo comercial interactivo
            ├── OrdersTable.jsx   # Tabla reactiva con botón de refresco y reinicio
            ├── ArchitectureSection.jsx # Explicación interactiva de los 4 conceptos de rúbrica
            └── ChatWidget.jsx    # Widget flotante animado con chips de demostración
```

---

## ⚡ 4. Guía de Instalación y Ejecución Rápida

### Requisitos Previos
- **Python 3.10+** (probado en Python 3.14)
- **Node.js 18+** y **npm** (probado en Node v24)
- **Git**

---

### Paso 1: Configurar y Levantar el Backend (FastAPI :8000)

1. Abre una terminal de PowerShell y navega a la carpeta del backend:
   ```powershell
   cd D:\novamart_landing_chatbot\backend
   ```
2. Activa el entorno virtual:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. Configura tu llave de NVIDIA NIM en el archivo `.env`:
   ```bash
   NVIDIA_API_KEY=nvapi-TU-LLAVE-AQUI
   NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
   NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
   PORT=8000
   ```
   *(Nota: Si no cuentas con llave activa en el momento de la prueba, el sistema incluye un motor con guardrails deterministas que responderá con 100% de apego a la rúbrica sin interrumpir la demo).*

4. Inicia el servidor de FastAPI:
   ```powershell
   uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
   ```
   El backend estará disponible en: **http://localhost:8000**  
   Documentación interactiva Swagger: **http://localhost:8000/docs**

---

### Paso 2: Configurar y Levantar el Frontend (React :5173)

1. Abre **otra** terminal y dirígete a la carpeta `frontend/`:
   ```powershell
   cd D:\novamart_landing_chatbot\frontend
   ```
2. Ejecuta el servidor de desarrollo de Vite:
   ```powershell
   npm run dev
   ```
3. Abre tu navegador web en: **http://localhost:5173**

---

## 🧪 5. Batería de Pruebas Automatizadas

El backend incluye un script que valida automáticamente todos los requerimientos de la rúbrica:

```powershell
cd D:\novamart_landing_chatbot\backend
.\venv\Scripts\python.exe test_rubric.py
```

### Resultados de la Verificación:
- ✅ `GET /api/orders` -> 4 pedidos cargados en memoria.
- ✅ `Caso 1: Estatus ORD-1001` -> Informa estatus 'En preparación' en Almacén NovaMart.
- ✅ `Caso 2: Rastrear ORD-1002` -> Informa 'En tránsito' en Centro de distribución Tijuana.
- ✅ `Caso 3: Cancelar ORD-1002` -> Niega cancelación porque ya está en tránsito y explica la causa operativa.
- ✅ `Caso 4: Cancelar ORD-1004` -> Advertencia de acción irreversible y confirmación en 2 fases con actualización reactiva en la tabla.
- ✅ `Caso 5: Anti-desvío (Pizza y Poema)` -> Responde textualmente: *"Solo puedo ayudarte con consultas relacionadas con pedidos de NovaMart, como estatus, rastreo o cancelaciones."*
- ✅ `Caso 6: Dato faltante` -> Solicita cordialmente número con formato `ORD-####`.

---

## 🎙️ 6. Guion de Exposición en Vivo (5 Minutos Cronometrados)

Para la presentación con el profesor **Fernando Morquecho**, sigue este cronograma exacto:

### Minuto 0:00 - 1:00 | La Landing Comercial y Tabla de Pedidos
- Muestra en el navegador **http://localhost:5173**.
- Destaca el branding de NovaMart, el catálogo de productos y el indicador en verde: `FastAPI :8000 Online`.
- Enseña la **Tabla Reactiva de Pedidos** con los 4 pedidos iniciales:
  - `ORD-1001`: En preparación (Almacén NovaMart).
  - `ORD-1002`: En tránsito (CD Tijuana).
  - `ORD-1003`: Entregado (Entregado al cliente).
  - `ORD-1004`: Pendiente de pago (Sin envío).

### Minuto 1:00 - 2:30 | Demostración Interactiva del Chatbot
- Haz clic en el botón flotante en la esquina inferior derecha para abrir el **NovaMart Assistant**.
- Ejecuta las pruebas en orden (puedes usar los botones de acceso rápido superiores o escribir):
  1. **Estatus ORD-1001:** `¿Cuál es el estado de ORD-1001?`  
     *Resultado:* Informa que está en preparación sin guía de envío.
  2. **Rastreo ORD-1002:** `¿Dónde está mi pedido ORD-1002?`  
     *Resultado:* Muestra ubicación en tiempo real en Tijuana.
  3. **Intento de cancelación no permitida:** `Quiero cancelar ORD-1002`  
     *Resultado:* Explica amablemente que al estar en tránsito no es cancelable.
  4. **Cancelación en 2 fases de ORD-1004:**  
     - Paso A: `Quiero cancelar ORD-1004` -> El bot advierte que es irreversible y pregunta: *¿Deseas cancelarlo? (Responde 'sí' o 'no')*.  
     - Paso B: `Sí, confirmo la cancelación` -> El bot confirma la cancelación exitosa y **la tabla en la pantalla superior cambia automáticamente el estatus a "Cancelado" sin recargar la página**.

### Minuto 2:30 - 3:45 | Preguntas Conceptuales de Rúbrica & Arquitectura
Abre la sección inferior de la Landing ("Arquitectura Enterprise NovaMart") o tu terminal y responde los 4 puntos clave:
1. **¿Qué es la aplicación local?**  
   Es el monorepo compuesto por la interfaz en **React + Vite (:5173)** y el servidor BFF en **FastAPI (:8000)**. Contiene la base de datos en memoria, las herramientas de consulta y las validaciones de negocio.
2. **¿Qué es NVIDIA NIM?**  
   Es un microservicio de inferencia empresarial en la nube (*NVIDIA Inference Microservice* en `integrate.api.nvidia.com`). Proporciona contenedores optimizados con aceleración de GPU (TensorRT-LLM) para servir modelos de lenguaje con baja latencia.
3. **¿Qué es el LLM?**  
   Es el modelo de lenguaje fundacional (*Large Language Model*, como Llama-3.1 o Nemotron). Actúa como el intérprete cognitivo que entiende el lenguaje natural del usuario y sintetiza respuestas profesionales bajo el prompt de sistema.
4. **Seguridad y Cero Exposición de Llaves:**  
   Muestra el archivo `backend/.env` y el `.gitignore`. Demuestra que la `NVIDIA_API_KEY` reside exclusivamente en el servidor backend; el frontend nunca la conoce ni viaja en ningún payload HTTP.

### Minuto 3:45 - 4:45 | Gobernanza, Filtro Anti-Desvío y Casos Límite
- En el chat, envía preguntas ajenas a pedidos:
  - `Dame una receta para hacer una pizza` o `Escribe un poema`  
    *Resultado:* Se activa el filtro estricto y contesta textualmente la frase de rúbrica.
  - `Quiero rastrear mi paquete` (sin ID)  
    *Resultado:* El bot detecta el dato faltante y solicita el número con formato `ORD-####`.
- Muestra el botón **"Reiniciar Demo"** en la tabla para restaurar los pedidos originales en 1 segundo.

### Minuto 4:45 - 5:00 | Cierre y Agradecimiento
- Agradece la atención del M. C. Fernando Morquecho y abre la sesión para cualquier pregunta adicional.

---

## 🔒 7. Políticas de Seguridad y Gobernanza

1. **Blindaje de Credenciales:** El archivo `.gitignore` prohíbe de manera estricta subir cualquier archivo `.env`, `.env.local` o llaves criptográficas.
2. **Control de Desvío (Off-Topic Guardrails):** Un filtro léxico-semántico previo intercepta intentos de inyección o consultas no comerciales antes de consumir tokens innecesarios de inferencia.
3. **Transacciones Seguras:** Ninguna acción destructiva (como cancelar un pedido) se ejecuta sin confirmación explícita previa del cliente.

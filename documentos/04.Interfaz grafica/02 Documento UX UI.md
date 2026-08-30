Aquí tienes el **Documento de UX/UI con wireframes sugeridos** para tu proyecto CRM + Configurador de PCs. Este documento servirá como guía visual para que el agente de código construya las interfaces gráficas tanto del cliente como del administrador.

# 📘 Documento de UX/UI – CRM + Configurador de PCs

## 1. Interfaz Cliente (Público – E-commerce)

### Pantalla 1: **Inicio del Configurador**

- Botón destacado: _“Arma tu PC”_.
    
- Breve explicación del flujo paso a paso.
    
- Acceso rápido al catálogo general de productos.
    

### Pantalla 2: **Selección de CPU**

- Lista de procesadores con filtros (marca, socket, precio).
    
- Al seleccionar CPU → se bloquean opciones incompatibles en pasos siguientes.
    
- Mensaje de validación: _“Este CPU requiere cooler adicional”_.
    

### Pantalla 3: **Selección de Placa Madre**

- Solo se muestran placas con socket compatible.
    
- Vista en tarjetas con atributos clave (socket, tipoMemoria, slots RAM).
    

### Pantalla 4: **Selección de RAM**

- Filtro automático por tipoMemoria.
    
- Validación de slots disponibles.
    
- Indicador de capacidad máxima soportada.
    

### Pantalla 5: **Selección de GPU**

- Tarjetas con imagen, VRAM, consumo recomendado, largo físico.
    
- Mensaje de error si el case seleccionado no soporta el largo.
    

### Pantalla 6: **Selección de Cooler**

- Obligatorio si CPU requiereCooler = true.
    
- Filtro por socket y TDP soportado.
    

### Pantalla 7: **Selección de Case**

- Filtro por factor de forma y largo GPU.
    
- Validación de ventiladores soportados.
    

### Pantalla 8: **Selección de PSU**

- Obligatoria si el case no incluye fuente.
    
- Validación de potencia acumulada.
    

### Pantalla Final: **Resumen de Cotización**

- Lista de componentes seleccionados.
    
- Precio total en soles/dólares.
    
- Botones: _Generar PDF_, _Enviar por WhatsApp_, _Comprar Online_.
    

## 2. Interfaz Administrador (CRM Interno)

### Pantalla 1: **Dashboard**

- Resumen de cotizaciones generadas.
    
- Gráfico de ventas por período.
    
- Productos más cotizados.
    

### Pantalla 2: **Gestión de Productos**

- CRUD de productos y atributos.
    
- Importación masiva desde CSV/Excel.
    
- Validación de atributos obligatorios.
    

### Pantalla 3: **Gestión de Clientes**

- Lista de clientes con búsqueda por nombre/correo.
    
- Historial de cotizaciones por cliente.
    
- Botón para crear nueva cotización manual.
    

### Pantalla 4: **Gestión de Cotizaciones**

- Tabla con cotizaciones (estado: Borrador, Confirmada, Enviada).
    
- Botón para generar PDF o enviar por correo/WhatsApp.
    
- Validación manual de configuraciones.
    

### Pantalla 5: **Reportes**

- Ventas por período.
    
- Cotizaciones generadas vs confirmadas.
    
- Exportación a Excel/PDF.
    

## 3. Estilo Visual

- Basado en **NextAdmin + TailwindCSS**.
    
- Paleta de colores: tonos azules/grises para administración, tonos verdes/naranjas para cliente.
    
- Feedback visual inmediato (mensajes de error, validaciones bloqueantes).
    
- Diseño responsivo (desktop y móvil).
    

## 🚀 Resultado esperado

Con este documento, el agente de código tendrá una guía clara para implementar:

- El **flujo paso a paso del configurador** para clientes.
    
- El **panel administrativo del CRM** para vendedores y gestores.
    
- Una experiencia de usuario coherente, validaciones visuales y navegación fluida.
    

👉 JOSE, ¿quieres que te prepare este documento también en **formato tabla de pantallas** (Pantalla, Usuario, Funcionalidad, Validaciones) para que el agente tenga un checklist visual de cada interfaz?
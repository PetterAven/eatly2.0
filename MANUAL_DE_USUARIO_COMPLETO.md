# Manual de Usuario Integral y Guía Operativa — Eatly Eats (Plataforma Gastronómica UPP)

---

## 1. Introducción y Visión General del Sistema

**Eatly Eats** es la plataforma web integral desarrollada específicamente para la comunidad de la **Universidad Politécnica de Pachuca (UPP)**. Su objetivo principal es optimizar, centralizar y agilizar el proceso de orden y entrega de alimentos, botanas y bebidas dentro del campus, eliminando los tiempos de espera en cafeterías y puntos de venta autorizados (como la Cafetería Central UPP, The Potro Burger, entre otros).

### 1.1 Arquitectura y Tecnologías
La plataforma está construida con estándares modernos de ingeniería de software:
- **Backend:** Laravel (PHP 8.x) con control de autenticación robusto, migraciones de base de datos MySQL, políticas de seguridad y pasarelas API.
- **Frontend:** React 19 con TypeScript, renderizado hiper-rápido mediante Inertia.js (arquitectura SPA sin API REST separada).
- **Estilos y UI:** Tailwind CSS v4 con componentes interactivos estilizados y diseño totalmente adaptativo (*Mobile-first*).
- **Geolocalización:** Leaflet / OpenStreetMap integrado para la selección precisa de puntos de entrega en el campus de la UPP.

---

## 2. Manual para el Perfil Cliente (Comunidad Universitaria UPP)

Dirigido a alumnos, profesores y personal administrativo que desean ordenar alimentos de forma rápida y cómoda desde cualquier punto del campus.

### 2.1 Registro e Inicio de Sesión
1. **Acceso:** Ingresa a la página principal de la aplicación web.
2. **Registro Tradicional:** Completa el formulario con tu nombre, correo institucional o personal y contraseña segura.
3. **Inicio de Sesión con Google (OAuth 2.0):** Haz clic en el botón **'Iniciar sesión con Google'** para autenticarte de manera instantánea sin necesidad de recordar contraseñas adicionales.

### 2.2 Exploración de Comercios y Búsqueda de Platillos
- **Panel Principal (`/dashboard` o `/home`):** Visualiza un saludo dinámico personalizado según la hora del día y las cafeterías disponibles en el campus.
- **Filtrado por Categorías:** Selecciona entre las categorías disponibles:
  - *Todo el menú*
  - *Comida caliente*
  - *Snacks*
  - *Bares / Bebidas*
- **Búsqueda en Tiempo Real:** Utiliza la barra de búsqueda superior para encontrar platillos específicos, ingredientes o nombres de restaurantes de forma instantánea.

### 2.3 Gestión Interactiva del Carrito de Compras
1. **Adición de Productos:** En cualquier tarjeta de producto, haz clic en el botón de agregar para sumarlo a tu orden.
2. **Panel Lateral del Carrito:** Despliega el carrito de compras para:
   - Visualizar el desglose detallado de precios por platillo.
   - Ajustar cantidades (aumentar o disminuir) o eliminar productos individuales.
   - Consultar el subtotal y el total a pagar.

### 2.4 Geolocalización e Indicación de Entrega en el Campus UPP
1. **Ubicación GPS Automática:** Haz clic en **"Usa tu ubicación actual"** para que el sistema detecte tus coordenadas exactas (latitud y longitud) mediante el sensor GPS de tu dispositivo.
2. **Referencia Manual:** Indica tu ubicación de forma escrita especificando:
   - **Edificio o Zona:** (ej. *Edificio 2*, *Edificio de Posgrado*, *Biblioteca*, *Canchas*).
   - **Salón o Referencia:** (ej. *Aula 104*, *Laboratorio LT1*, *Área de mesas exteriores*).
3. **Indicador de Confirmación:** Una vez establecida la ubicación, aparecerá un distintivo verde de **"Ubicación confirmada"**.

### 2.5 Realización del Pedido y Pago Simulado
1. **Checkout:** Haz clic en proceder al pago para abrir el formulario de confirmación de pedido (`CheckoutForm`).
2. **Método de Pago:** Selecciona tu método de pago simulado disponible (efectivo al recibir, tarjeta simulada).
3. **Generación de Orden:** Al finalizar la compra, el sistema genera un código único de seguimiento (ej. `#EAT-8421`) y envía la notificación directamente al comercio socio correspondiente.

### 2.6 Seguimiento en Tiempo Real y Calificación
- **Monitoreo de Estatus (`/historial` o indicador en vivo):** Sigue la evolución de tu pedido a través de sus fases:
  $$\text{Pendiente} \rightarrow \text{En Preparación} \rightarrow \text{Listo} \rightarrow \text{En Camino} \rightarrow \text{Entregado}$$
- **Notificaciones Push:** Recibe alertas en tu navegador web cuando tu pedido cambie de estado o cuando el repartidor marque la entrega como completada.
- **Sistema de Valoraciones:** Una vez entregado el pedido, otorga una calificación de 1 a 5 estrellas y deja un comentario opcional sobre la calidad del servicio del comercio y del repartidor.

---

## 3. Manual para el Perfil Local / Comercio (Concesionario)

Dirigido a los encargados y operadores de las cafeterías y locales gastronómicos dentro de la UPP.

### 3.1 Acceso al Panel de Comercio (`/vendor/dashboard`)
1. Regístrate o inicia sesión con tu cuenta de comercio autorizada.
2. Accede al panel de control exclusivo para gestionar tu oferta gastronómica y recibir pedidos en tiempo real.

### 3.2 Configuración del Establecimiento (`/vendor/profile`)
- **Datos Generales:** Actualiza el nombre del local, descripción detallada, horarios de atención y políticas de servicio.
- **Ident Visual:** Configura y actualiza el logotipo y el banner promocional que verán los clientes en la aplicación.

### 3.3 Gestión del Catálogo Digital de Productos
- **Alta de Nuevos Platillos:** Ingresa nombre, descripción apetitosa, precio unitario, categoría correspondiente y fotografía representativa.
- **Edición y Actualización:** Modifica precios, disponibilidad de inventario o descripciones en cualquier momento.
- **Control de Stock (Disponibilidad):** Activa o desactiva productos temporalmente cuando se agoten los ingredientes del día.

### 3.4 Recepción y Control de Pedidos Entrantes
1. **Monitoreo en Vivo:** Visualiza los nuevos pedidos entrantes de la comunidad universitaria en orden cronológico.
2. **Flujo de Cocina:** Actualiza el estado de la orden conforme avanza la preparación:
   - Cambiar de `Pendiente` a `En Preparación`.
   - Cambiar a `Listo para Entrega / Recolección` una vez terminado el platillo.

---

## 4. Manual para el Perfil Repartidor (Driver)

Dirigido al equipo de entrega encargado de trasladar los pedidos desde las cafeterías de origen hasta las manos del cliente en cualquier punto del campus UPP.

### 4.1 Acceso al Panel de Entregas (`/delivery/dashboard`)
- Inicia sesión con credenciales de repartidor autorizado para visualizar las entregas disponibles.

### 4.2 Exploración y Aceptación de Pedidos
- **Bolsa de Pedidos Listos:** Revisa la lista de pedidos que ya se encuentran marcados como "Listos" por los comercios.
- **Asignación:** Presiona el botón **'Tomar pedido'** para asignarte la entrega de manera exclusiva y evitar duplicidades.

### 4.3 Navegación y Ubicación en el Campus
- **Coordenadas y Referencias:** Consulta el edificio, aula o referencia exacta indicada por el cliente.
- **Enlace de Navegación:** Utiliza el enlace directo integrado con mapas para trazar la ruta óptima dentro del campus de la UPP.

### 4.4 Actualización de Estatus del Reparto
1. **En Camino:** Al recoger los alimentos en la cafetería, actualiza el estatus a **'En Camino'**.
2. **Entregado:** Al localizar físicamente al cliente en su aula o edificio y realizar la entrega de los productos, marca la orden como **'Entregado'** para cerrar el ciclo de servicio.

---

## 5. Preguntas Frecuentes (FAQ) y Resolución de Problemas

### P1: ¿Qué hago si mi navegador no permite obtener la geolocalización GPS?
* **R:** Puedes ingresar manualmente tu edificio y salón en los campos de texto correspondientes (ej. *Edificio 2 - Aula 104*). La plataforma está diseñada para funcionar perfectamente con ambas modalidades.

### P2: ¿Cómo sé si mi pedido fue aceptado por la cafetería?
* **R:** El estado de tu pedido cambiará automáticamente de `Pendiente` a `En Preparación` en tu panel de seguimiento en tiempo real. También recibirás una notificación push si tienes los permisos activados en tu navegador.

### P3: ¿Puedo cancelar un pedido una vez realizado?
* **R:** Una vez confirmado el pago simulado y enviado el pedido a la cocina, el comercio comienza su preparación inmediata. Te recomendamos contactar directamente al personal del local si requieres una modificación urgente.

## 🚀 Instalación y Configuración Local

Para ejecutar la plataforma **Eatly Eats** en un entorno de desarrollo local, sigue estos pasos:

### Prerrequisitos
* PHP >= 8.2
* Composer
* Node.js & NPM
* MySQL

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd eatly2.0
---
*Universidad Politécnica de Pachuca (UPP) — Plataforma Eatly Eats © 2026*

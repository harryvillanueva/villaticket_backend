# 🎟️ Villaticket - Plataforma Integral de Gestión y Venta de Entradas

Este proyecto es una aplicación web robusta diseñada para la gestión de eventos, venta de entradas digitales y control de accesos. Está construido siguiendo los principios de **Arquitectura Hexagonal** y **Clean Architecture** utilizando el ecosistema de Spring Boot.

## 🚀 Tecnologías Utilizadas

**Backend**
* **Java 17 & Spring Boot 3:** Núcleo del servidor y API REST.
* **Spring Security & JWT:** Autenticación "stateless" y control de acceso basado en roles (RBAC).
* **Spring Data JPA:** Persistencia de datos y mapeo objeto-relacional (ORM) con control transaccional ACID.
* **MySQL:** Base de datos relacional para la gestión de usuarios, eventos, zonas, transacciones y monederos.
* **Generación de Archivos:** Integración para la creación de tickets en formato PDF y generación dinámica de códigos QR.

**Frontend**
* **HTML5 & CSS3:** Interfaz moderna, responsiva y diseñada a medida.
* **Vanilla JavaScript (ES6+):** Lógica de cliente asíncrona mediante **Fetch API** para una experiencia fluida tipo Single Page Application (SPA).
* **UX/UI Personalizada:** Sistema propio de notificaciones (*Toasts*) e indicadores de carga (*Spinners*) interactivos, sin dependencias de frameworks pesados.

## 🏛️ Arquitectura

El sistema implementa una **Arquitectura Hexagonal (Puertos y Adaptadores)** que separa estrictamente el dominio de la aplicación de las dependencias externas:
* **Dominio:** Entidades puras y reglas de negocio sin dependencias de frameworks (Usuarios, Eventos, Carteras, Tickets).
* **Aplicación:** Casos de uso centralizados que orquestan el comportamiento del sistema (Ej. `ProcesarCompra`, `ValidarTicket`, `GenerarTicketPdf`).
* **Infraestructura:** Adaptadores de entrada (Controladores REST, Filtros JWT de seguridad) y salida (Repositorios MySQL JPA, servicios de Email).

## ✨ Funcionalidades Clave

* **Control Multinivel:** Roles diferenciados y seguros para Clientes (compradores), Vendedores (organizadores) y Súper Administradores.
* **Marketplace de Eventos:** Los vendedores pueden crear eventos, subir banners, definir múltiples zonas de precios y gestionar el aforo en tiempo real.
* **Motor Financiero y Monedero Virtual:** Cálculo automático de comisiones (10% para la plataforma) por cada venta. Los vendedores disponen de un panel para solicitar retiros de sus ganancias hacia su cuenta bancaria (IBAN).
* **Ciclo de Vida de Entradas (QR):** Generación automática de entradas nominativas con códigos QR únicos y cifrados.
* **Control de Accesos (Escáner):** Módulo web integrado para escanear y validar los códigos QR físicos el día del evento, previniendo duplicados y validando la propiedad del evento.
* **Moderación Global:** El Súper Admin cuenta con un "Centro de Mando" para aprobar retiros financieros, cancelar eventos, gestionar categorías y bloquear/activar usuarios del sistema.

## 🛠️ Configuración e Instalación

**1. Requisitos Previos:**
* JDK 17 o superior.
* MySQL Server (v8.0+).
* Maven (integrado en tu IDE).

**2. Base de Datos:**
* Crear una base de datos vacía en MySQL llamada `tfg_db`.
* *(Nota: Las tablas se generarán automáticamente al arrancar la aplicación gracias a Hibernate).*

**3. Configuración (`src/main/resources/application.properties`):**
* Ajustar las credenciales de la base de datos local:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/tfg_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
  spring.datasource.username=root
  spring.datasource.password=tu_contraseña_mysql
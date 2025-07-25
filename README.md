# PBD Store - Sistema de Gestión para Tienda de Ropa en Línea

**Proyecto Final de Bases de Datos**

Sistema integral de gestión para tienda de ropa en línea que implementa un catálogo de productos completo, control de inventario en tiempo real, procesamiento de órdenes y paneles administrativos avanzados.

## 🚀 Tecnologías Principales

### Frontend
- **React 19** con **TypeScript** - Framework principal con tipado estático
- **TanStack Router** - Enrutamiento avanzado con validación de parámetros
- **TanStack Query** - Gestión de estado del servidor y caché
- **TanStack Form** - Manejo de formularios con validación
- **Tailwind CSS v4** - Framework de estilos utility-first
- **shadcn/ui** - Biblioteca de componentes UI modernas
- **Lucide React** - Iconografía consistente

### Backend & Base de Datos
- **TanStack Start** - Full-stack React framework
- **PostgreSQL 15** - Base de datos relacional robusta
- **Docker Compose** - Contenedorización de servicios
- **Zod** - Validación de esquemas y tipos
- **JWT** - Autenticación basada en tokens

### Herramientas de Desarrollo
- **Vite 6** - Build tool y servidor de desarrollo
- **Vitest** - Framework de testing
- **Testing Library** - Utilidades para testing de componentes
- **pnpm** - Gestor de paquetes eficiente

## 🏗️ Arquitectura del Sistema

### Estructura General
```
Frontend (React) ↔ TanStack Start ↔ PostgreSQL
     ↓                    ↓              ↓
 UI Components      Server Actions   Esquema BD
 Estado Cliente     Autenticación    13 Entidades
 Enrutamiento       Validaciones     Relaciones
```

### Organización de Componentes
- **Componentes UI**: Sistema de diseño basado en shadcn/ui
- **Componentes de Negocio**: Modales, formularios y vistas específicas
- **Hooks Personalizados**: Lógica reutilizable para acceso a datos
- **Server Actions**: Funciones del servidor para operaciones CRUD


## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── auth/            # Componentes de autenticación
│   └── *.tsx            # Modales y componentes de negocio
├── routes/              # Páginas y rutas de la aplicación
│   ├── dashboard/       # Panel administrativo
│   ├── auth.verify.tsx  # Verificación de códigos
│   └── *.tsx           # Páginas principales
├── server/              # Lógica del servidor
│   ├── auth/           # Sistema de autenticación
│   ├── db/             # Esquema y consultas de BD
│   ├── dashboard/      # Acciones del dashboard
│   └── todos/          # Sistema de tareas
├── data-access/         # Hooks para acceso a datos
├── integrations/        # Configuración de TanStack Query
└── lib/                # Utilidades y helpers
```

## ⚡ Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ 
- **pnpm** (gestor de paquetes)
- **Docker** y **Docker Compose**

### Configuración Inicial

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd pbd
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` en la raíz:
```env
DB_CONNECTION_STRING=postgresql://postgres:postgres@localhost:5432/pbd
JWT_SECRET=tu_clave_secreta_jwt_de_al_menos_32_caracteres
RESEND_API_KEY=tu_clave_de_resend_para_emails
```

4. **Iniciar base de datos**
```bash
# Levantar contenedor PostgreSQL
pnpm run db:local

# Inicializar esquema y datos (ejecutar solo la primera vez)
pnpm run db:setup
```

5. **Ejecutar en desarrollo**
```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles
- `pnpm run dev` - Servidor de desarrollo (puerto 3000)
- `pnpm run build` - Build de producción
- `pnpm run serve` - Preview del build
- `pnpm run test` - Ejecutar tests
- `pnpm run db:local` - Levantar PostgreSQL
- `pnpm run db:setup` - Inicializar base de datos

## 🎯 Características Principales

### 🛍️ Catálogo de Productos
- **Gestión completa de productos** organizados por categorías y marcas
- **Sistema de variantes** con combinaciones de talla y color
- **Precios diferenciados** por variante con soporte para ofertas
- **Información detallada** incluyendo material, peso y descripción
- **Estados de producto** (activo/inactivo) para control de visibilidad

### 📦 Control de Inventario
- **Seguimiento en tiempo real** del stock para cada variante
- **Alertas automáticas** de productos con stock bajo
- **Gestión de stock mínimo y máximo** por variante
- **Historial de movimientos** con fechas de última actualización
- **Acciones rápidas** para ajuste de inventario
- **Vista consolidada** con valor total del inventario

### 🛒 Gestión de Órdenes
- **Procesamiento completo** desde creación hasta entrega
- **Estados de pedido** (pendiente, procesando, enviado, entregado)
- **Seguimiento detallado** con fechas estimadas y reales
- **Múltiples métodos de pago** soportados
- **Cálculo automático** de subtotales y descuentos
- **Historial completo** de órdenes por cliente

### 👥 Gestión de Clientes
- **Perfiles completos** con información de contacto
- **Historial de compras** y preferencias
- **Sistema de newsletter** con suscripciones
- **Direcciones de envío** múltiples
- **Segmentación** entre clientes y empleados

### 🏢 Gestión de Proveedores
- **Información completa** de empresas proveedoras
- **Datos de contacto** y ubicación
- **Relación con productos** suministrados
- **Gestión internacional** con soporte para múltiples países

### 📊 Reportes y Analíticas
- **Dashboard ejecutivo** con métricas clave
- **Reportes de ventas** por producto y período
- **Análisis de clientes** top por volumen de compra
- **Productos sin movimiento** para optimización de inventario
- **Valor promedio de órdenes** y tendencias
- **Resumen mensual** de ventas con comparativas

### 🔐 Sistema de Autenticación
- **Autenticación sin contraseñas** mediante códigos por email
- **JWT tokens** con expiración configurable
- **Roles diferenciados** (cliente/empleado)
- **Sesiones persistentes** con renovación automática
- **Códigos de verificación** con expiración y limpieza automática

## 🔧 Características Técnicas

### UI state management 
- **TanStack Query** para caché y sincronización del servidor
- **URL State** para filtros y paginación persistentes
- **Optimistic Updates** para mejor experiencia de usuario

### Validación y Tipos
- **Zod schemas** para validación en cliente y servidor
- **TypeScript estricto** con configuración robusta
- **Validación de rutas** con parámetros tipados


### Seguridad
- **Sanitización de inputs** en todas las operaciones
- **Validación server-side** de todas las acciones
- **Manejo seguro de JWT** con httpOnly cookies


---

**Desarrollado como Proyecto Final de Bases de Datos**  
*Sistema integral de gestión para tienda de ropa en línea*

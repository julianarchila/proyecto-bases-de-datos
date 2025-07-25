// Database table types generated from schema.sql

export interface Persona {
  id_persona: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion?: string
  fecha_nacimiento?: Date
}

export interface Cliente {
  id_cliente: number
  fecha_registro: Date
  preferencias_newsletter: boolean
}

export interface Empleado {
  id_empleado: number
  cargo: string
  salario: string // PostgreSQL MONEY type
  fecha_contratacion: Date
  estado_activo: boolean
}

export interface Categoria {
  id_categoria: number
  nombre_categoria: string
  categoria_activa: boolean
  descripcion_categoria?: string
}

export interface Marca {
  id_marca: number
  nombre_marca: string
  descripcion_marca?: string
  pais_origen?: string
  website?: string
}

export interface Proveedor {
  id_proveedor: number
  nombre_empresa: string
  email_proveedor: string
  telefono_proveedor: string
  direccion_proveedor: string
  ciudad: string
  pais: string
}

export interface Color {
  id_color: number
  nombre_color: string
  codigo_hex: string
  descripcion_color?: string
}

export interface Talla {
  id_talla: number
  codigo_talla: string
  descripcion_talla: string
  equivalencia_numerica: number
}

export interface Producto {
  id_producto: number
  id_categoria?: number
  id_marca: number
  id_proveedor: number
  nombre_producto: string
  descripcion: string
  precio: string // PostgreSQL MONEY type
  precio_oferta?: string // PostgreSQL MONEY type
  peso?: number
  material?: string
}

export interface VarianteProducto {
  id_variante: number
  id_producto: number
  id_talla: number
  id_color: number
  sku?: string
  precio_variante?: string // PostgreSQL MONEY type
  variante_activa?: boolean
}

export interface Inventario {
  id_inventario: number
  id_variante: number
  cantidad_stock: number
  stock_minimo: number
  stock_maximo: number
  fecha_ultima_actualizacion: Date
}

export interface Orden {
  id_orden: number
  fecha_orden: Date
  direccion_envio: string
  fecha_entrega_real: Date
  estado_pedido: string
  total_orden: string // PostgreSQL MONEY type
  fecha_entrega_estimada?: Date
  metodo_pago?: string
  id_persona: number
}

export interface OrdenProducto {
  id_variante: number
  id_orden: number
  id_persona: number
  cantidad: number
  precio_unitario: string // PostgreSQL MONEY type
  subtotal: string // PostgreSQL MONEY type
  descuento_aplicado?: string // PostgreSQL MONEY type
}

export interface AuthCode {
  id_auth_code: number
  email: string
  code: string
  expires_at: Date
  used: boolean
  created_at: Date
}

// Utility types for common operations

// Insert types (without auto-generated IDs)
export type PersonaInsert = Omit<Persona, 'id_persona'>
export type CategoriaInsert = Omit<Categoria, 'id_categoria'>
export type MarcaInsert = Omit<Marca, 'id_marca'>
export type ProveedorInsert = Omit<Proveedor, 'id_proveedor'>
export type ColorInsert = Omit<Color, 'id_color'>
export type TallaInsert = Omit<Talla, 'id_talla'>
export type ProductoInsert = Omit<Producto, 'id_producto'>
export type VarianteProductoInsert = Omit<VarianteProducto, 'id_variante'>
export type InventarioInsert = Omit<Inventario, 'id_inventario'>
export type OrdenInsert = Omit<Orden, 'id_orden'>
export type AuthCodeInsert = Omit<AuthCode, 'id_auth_code' | 'created_at'>

// Update types (all fields optional except ID)
export type PersonaUpdate = Partial<Persona> & Pick<Persona, 'id_persona'>
export type CategoriaUpdate = Partial<Categoria> & Pick<Categoria, 'id_categoria'>
export type MarcaUpdate = Partial<Marca> & Pick<Marca, 'id_marca'>
export type ProveedorUpdate = Partial<Proveedor> & Pick<Proveedor, 'id_proveedor'>
export type ColorUpdate = Partial<Color> & Pick<Color, 'id_color'>
export type TallaUpdate = Partial<Talla> & Pick<Talla, 'id_talla'>
export type ProductoUpdate = Partial<Producto> & Pick<Producto, 'id_producto'>
export type VarianteProductoUpdate = Partial<VarianteProducto> & Pick<VarianteProducto, 'id_variante'>
export type InventarioUpdate = Partial<Inventario> & Pick<Inventario, 'id_inventario'>
export type OrdenUpdate = Partial<Orden> & Pick<Orden, 'id_orden'>

// Join types for common queries
export interface ProductoCompleto extends Producto {
  categoria?: Categoria
  marca: Marca
  proveedor: Proveedor
}

export interface VarianteCompleta extends VarianteProducto {
  producto: Producto
  color: Color
  talla: Talla
  inventario?: Inventario
}

export interface PersonaCompleta extends Persona {
  cliente?: Cliente
  empleado?: Empleado
}

export interface OrdenCompleta extends Orden {
  persona: Persona
  productos: Array<OrdenProducto & {
    variante: VarianteCompleta
  }>
}

// Auth-related types
export interface UserWithType extends Persona {
  user_type: 'cliente' | 'empleado'
  // Additional fields from CLIENTE or EMPLEADO tables
  fecha_registro?: Date
  preferencias_newsletter?: boolean
  cargo?: string
  salario?: string
  fecha_contratacion?: Date
  estado_activo?: boolean
}

export interface AuthUser {
  id_persona: number
  email: string
  user_type: 'cliente' | 'empleado'
  nombre: string
  apellido: string
}

// Enums for common values
export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  PROCESANDO = 'PROCESANDO',
  ENVIADO = 'ENVIADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  PAYPAL = 'PAYPAL'
}

// Helper type for database operations
export type DatabaseTables = {
  persona: Persona
  cliente: Cliente
  empleado: Empleado
  categoria: Categoria
  marca: Marca
  proveedor: Proveedor
  color: Color
  talla: Talla
  producto: Producto
  variante_producto: VarianteProducto
  inventario: Inventario
  orden: Orden
  orden_producto: OrdenProducto
  auth_codes: AuthCode
} 
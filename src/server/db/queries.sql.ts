import { sql } from "."
import type { 
  Categoria, 
  Producto, 
  ProductoCompleto, 
  Persona, 
  Cliente, 
  Empleado,
  Marca,
  Color,
  Talla,
  VarianteProducto,
  VarianteCompleta,
  Inventario,
  Orden,
  OrdenCompleta,
  Proveedor,
  AuthCode,
  AuthCodeInsert,
  UserWithType,
  AuthUser,
  EstadoPedido,
  MetodoPago
} from "./types"

// Additional result types for dashboard queries
export interface ProductSearchResult extends ProductoCompleto {
  nombre_categoria?: string
  nombre_marca: string
  proveedor_nombre: string
}

export interface OrderWithCustomer extends Orden {
  customer_name: string
  customer_email: string
}

export interface ProductVariantWithStock extends VarianteProducto {
  nombre_producto: string
  nombre_color: string
  codigo_hex: string
  codigo_talla: string
  descripcion_talla: string
  cantidad_stock: number
  stock_minimo: number
  stock_maximo: number
}

export interface LowStockAlert extends ProductVariantWithStock {
  // Inherits all fields from ProductVariantWithStock
}

export interface SalesAnalytics {
  product_id: number
  nombre_producto: string
  total_quantity_sold: number
  total_revenue: string // PostgreSQL MONEY type
  order_count: number
}

export interface MonthlyStats {
  month: number
  year: number
  total_orders: number
  total_revenue: string // PostgreSQL MONEY type
  average_order_value: string // PostgreSQL MONEY type
  unique_customers: number
}

export interface CustomerRanking {
  id_persona: number
  customer_name: string
  email: string
  total_spent: string // PostgreSQL MONEY type
  order_count: number
  last_order_date: Date
}

export interface UnusedProduct {
  id_producto: number
  nombre_producto: string
  precio: string
  fecha_creacion?: Date
}

export interface DashboardStats {
  total_products: number
  active_orders: number
  low_stock_count: number
  today_revenue: string
}

export const DB = {
  // ============================================================================
  // ACCESO Y RECUPERACIÓN BÁSICA (AR) - 10 Queries
  // ============================================================================

  // AR-01: Products with Category and Brand Details
  getProductsWithDetails: async (): Promise<ProductSearchResult[]> => {
    const res = await sql<ProductSearchResult[]>`
      SELECT 
        p.*,
        c.nombre_categoria,
        m.nombre_marca,
        pr.nombre_empresa as proveedor_nombre
      FROM PRODUCTO p
      LEFT JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      LEFT JOIN MARCA m ON p.id_marca = m.id_marca
      LEFT JOIN PROVEEDOR pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.nombre_producto
    `
    return res
  },

  // AR-02: Search Products by Name
  searchProductsByName: async (searchTerm: string): Promise<ProductSearchResult[]> => {
    const res = await sql<ProductSearchResult[]>`
      SELECT 
        p.*,
        c.nombre_categoria,
        m.nombre_marca,
        pr.nombre_empresa as proveedor_nombre
      FROM PRODUCTO p
      LEFT JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      LEFT JOIN MARCA m ON p.id_marca = m.id_marca
      LEFT JOIN PROVEEDOR pr ON p.id_proveedor = pr.id_proveedor
      WHERE LOWER(p.nombre_producto) LIKE LOWER(${'%' + searchTerm + '%'})
         OR LOWER(p.descripcion) LIKE LOWER(${'%' + searchTerm + '%'})
      ORDER BY p.nombre_producto
    `
    return res
  },

  // AR-03: Orders by Date Range
  getOrdersByDateRange: async (startDate: Date, endDate: Date): Promise<OrderWithCustomer[]> => {
    const res = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      WHERE o.fecha_orden BETWEEN ${startDate} AND ${endDate}
      ORDER BY o.fecha_orden DESC
    `
    return res
  },

  // AR-04: Products by Specific Categories
  getProductsByCategories: async (categoryIds: number[]): Promise<ProductSearchResult[]> => {
    const res = await sql<ProductSearchResult[]>`
      SELECT 
        p.*,
        c.nombre_categoria,
        m.nombre_marca,
        pr.nombre_empresa as proveedor_nombre
      FROM PRODUCTO p
      LEFT JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      LEFT JOIN MARCA m ON p.id_marca = m.id_marca
      LEFT JOIN PROVEEDOR pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_categoria = ANY(${categoryIds})
      ORDER BY c.nombre_categoria, p.nombre_producto
    `
    return res
  },

  // AR-05: Customer Orders with Status
  getOrdersByStatus: async (statuses: string[]): Promise<OrderWithCustomer[]> => {
    const res = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      WHERE o.estado_pedido = ANY(${statuses})
      ORDER BY o.fecha_orden DESC
    `
    return res
  },

  // AR-06: Recent Orders
  getRecentOrders: async (limit: number = 10): Promise<OrderWithCustomer[]> => {
    const res = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      ORDER BY o.fecha_orden DESC
      LIMIT ${limit}
    `
    return res
  },

  // AR-07: Product Variants with Complete Details
  getProductVariantsWithDetails: async (productId?: number): Promise<ProductVariantWithStock[]> => {
    const res = await sql<ProductVariantWithStock[]>`
      SELECT 
        vp.*,
        p.nombre_producto,
        c.nombre_color,
        c.codigo_hex,
        t.codigo_talla,
        t.descripcion_talla,
        COALESCE(i.cantidad_stock, 0) as cantidad_stock,
        COALESCE(i.stock_minimo, 0) as stock_minimo,
        COALESCE(i.stock_maximo, 0) as stock_maximo
      FROM VARIANTE_PRODUCTO vp
      JOIN PRODUCTO p ON vp.id_producto = p.id_producto
      JOIN COLOR c ON vp.id_color = c.id_color
      JOIN TALLA t ON vp.id_talla = t.id_talla
      LEFT JOIN INVENTARIO i ON vp.id_variante = i.id_variante
      WHERE (${productId ?? null}::int IS NULL OR vp.id_producto = ${productId ?? null})
        AND (vp.variante_activa IS NULL OR vp.variante_activa = true)
      ORDER BY p.nombre_producto, c.nombre_color, t.equivalencia_numerica
    `
    return res
  },

  // AR-08: Suppliers by Country/Region
  getSuppliersByCountry: async (country?: string): Promise<Proveedor[]> => {
    const res = await sql<Proveedor[]>`
      SELECT * FROM PROVEEDOR
      WHERE (${country ?? null}::text IS NULL OR LOWER(pais) = LOWER(${country ?? null}))
      ORDER BY pais, nombre_empresa
    `
    return res
  },

  // AR-09: Active Products with Current Stock
  getActiveProductsWithStock: async (): Promise<ProductVariantWithStock[]> => {
    const res = await sql<ProductVariantWithStock[]>`
      SELECT 
        vp.*,
        p.nombre_producto,
        c.nombre_color,
        c.codigo_hex,
        t.codigo_talla,
        t.descripcion_talla,
        COALESCE(i.cantidad_stock, 0) as cantidad_stock,
        COALESCE(i.stock_minimo, 0) as stock_minimo,
        COALESCE(i.stock_maximo, 0) as stock_maximo
      FROM VARIANTE_PRODUCTO vp
      JOIN PRODUCTO p ON vp.id_producto = p.id_producto
      JOIN COLOR c ON vp.id_color = c.id_color
      JOIN TALLA t ON vp.id_talla = t.id_talla
      LEFT JOIN INVENTARIO i ON vp.id_variante = i.id_variante
      WHERE (vp.variante_activa IS NULL OR vp.variante_activa = true)
        AND i.cantidad_stock > 0
      ORDER BY p.nombre_producto, c.nombre_color, t.equivalencia_numerica
    `
    return res
  },

  // AR-10: Orders by Payment Method
  getOrdersByPaymentMethod: async (paymentMethod?: string): Promise<OrderWithCustomer[]> => {
    const res = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      WHERE (${paymentMethod ?? null}::text IS NULL OR o.metodo_pago = ${paymentMethod ?? null})
      ORDER BY o.fecha_orden DESC
    `
    return res
  },

  // ============================================================================
  // FUNCIONES DE AGREGACIÓN (FA) - 5 Queries
  // ============================================================================

  // FA-01: Total Sales by Product
  getSalesByProduct: async (): Promise<SalesAnalytics[]> => {
    const res = await sql<SalesAnalytics[]>`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        COALESCE(SUM(op.cantidad), 0)::int as total_quantity_sold,
        COALESCE(SUM(op.subtotal), 0::money) as total_revenue,
        COUNT(DISTINCT o.id_orden)::int as order_count
      FROM PRODUCTO p
      LEFT JOIN VARIANTE_PRODUCTO vp ON p.id_producto = vp.id_producto
      LEFT JOIN ORDEN_PRODUCTO op ON vp.id_variante = op.id_variante
      LEFT JOIN ORDEN o ON op.id_orden = o.id_orden
      GROUP BY p.id_producto, p.nombre_producto
      ORDER BY total_revenue DESC
    `
    return res
  },

  // FA-02: Average Order Value
  getAverageOrderValue: async (): Promise<{ average_order_value: string }> => {
    const res = await sql<{ average_order_value: string }[]>`
      SELECT COALESCE(AVG(total_orden::numeric), 0)::money as average_order_value
      FROM ORDEN
      WHERE estado_pedido != 'CANCELADO'
    `
    return res[0] || { average_order_value: '$0.00' }
  },

  // FA-03: Product Count by Category
  getProductCountByCategory: async (): Promise<{ id_categoria: number, nombre_categoria: string, product_count: number }[]> => {
    const res = await sql<{ id_categoria: number, nombre_categoria: string, product_count: number }[]>`
      SELECT 
        c.id_categoria,
        c.nombre_categoria,
        COUNT(p.id_producto)::int as product_count
      FROM CATEGORIA c
      LEFT JOIN PRODUCTO p ON c.id_categoria = p.id_categoria
      WHERE c.categoria_activa = true
      GROUP BY c.id_categoria, c.nombre_categoria
      ORDER BY product_count DESC, c.nombre_categoria
    `
    return res
  },

  // FA-04: Low Stock Products Alert
  getLowStockProducts: async (): Promise<LowStockAlert[]> => {
    const res = await sql<LowStockAlert[]>`
      SELECT 
        vp.*,
        p.nombre_producto,
        c.nombre_color,
        c.codigo_hex,
        t.codigo_talla,
        t.descripcion_talla,
        i.cantidad_stock,
        i.stock_minimo,
        i.stock_maximo
      FROM INVENTARIO i
      JOIN VARIANTE_PRODUCTO vp ON i.id_variante = vp.id_variante
      JOIN PRODUCTO p ON vp.id_producto = p.id_producto
      JOIN COLOR c ON vp.id_color = c.id_color
      JOIN TALLA t ON vp.id_talla = t.id_talla
      WHERE i.cantidad_stock <= i.stock_minimo
        AND (vp.variante_activa IS NULL OR vp.variante_activa = true)
      ORDER BY (i.cantidad_stock::float / NULLIF(i.stock_minimo, 0)) ASC, p.nombre_producto
    `
    return res
  },

  // FA-05: Monthly Sales Summary
  getMonthlySalesSummary: async (year?: number): Promise<MonthlyStats[]> => {
    const res = await sql<MonthlyStats[]>`
      SELECT 
        EXTRACT(MONTH FROM o.fecha_orden)::int as month,
        EXTRACT(YEAR FROM o.fecha_orden)::int as year,
        COUNT(o.id_orden)::int as total_orders,
        COALESCE(SUM(o.total_orden), 0::money) as total_revenue,
        COALESCE(AVG(o.total_orden::numeric), 0)::money as average_order_value,
        COUNT(DISTINCT o.id_persona)::int as unique_customers
      FROM ORDEN o
      WHERE o.estado_pedido != 'CANCELADO'
        AND (${year ?? null}::int IS NULL OR EXTRACT(YEAR FROM o.fecha_orden) = ${year ?? null})
      GROUP BY EXTRACT(YEAR FROM o.fecha_orden), EXTRACT(MONTH FROM o.fecha_orden)
      ORDER BY year DESC, month DESC
    `
    return res
  },

  // ============================================================================
  // CONSULTAS AVANZADAS (QA) - 3 Queries
  // ============================================================================

  // QA-01: Products Never Ordered
  getProductsNeverOrdered: async (): Promise<UnusedProduct[]> => {
    const res = await sql<UnusedProduct[]>`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.precio
      FROM PRODUCTO p
      WHERE NOT EXISTS (
        SELECT 1 
        FROM VARIANTE_PRODUCTO vp
        JOIN ORDEN_PRODUCTO op ON vp.id_variante = op.id_variante
        WHERE vp.id_producto = p.id_producto
      )
      ORDER BY p.nombre_producto
    `
    return res
  },

  // QA-02: Top Customers by Purchase Amount
  getTopCustomersByPurchaseAmount: async (limit: number = 10): Promise<CustomerRanking[]> => {
    const res = await sql<CustomerRanking[]>`
      SELECT 
        p.id_persona,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email,
        COALESCE(SUM(o.total_orden), 0::money) as total_spent,
        COUNT(o.id_orden)::int as order_count,
        MAX(o.fecha_orden) as last_order_date
      FROM PERSONA p
      JOIN CLIENTE c ON p.id_persona = c.id_cliente
      LEFT JOIN ORDEN o ON p.id_persona = o.id_persona AND o.estado_pedido != 'CANCELADO'
      GROUP BY p.id_persona, p.nombre, p.apellido, p.email
      HAVING COUNT(o.id_orden) > 0
      ORDER BY total_spent DESC
      LIMIT ${limit}
    `
    return res
  },

  // QA-03: Products with Above Average Price
  getProductsAboveAveragePrice: async (): Promise<ProductSearchResult[]> => {
    const res = await sql<ProductSearchResult[]>`
      SELECT 
        p.*,
        c.nombre_categoria,
        m.nombre_marca,
        pr.nombre_empresa as proveedor_nombre
      FROM PRODUCTO p
      LEFT JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      LEFT JOIN MARCA m ON p.id_marca = m.id_marca
      LEFT JOIN PROVEEDOR pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.precio::numeric > (
        SELECT AVG(precio::numeric) 
        FROM PRODUCTO 
        WHERE precio IS NOT NULL
      )
      ORDER BY p.precio DESC
    `
    return res
  },

  // ============================================================================
  // DASHBOARD STATISTICS - Helper Queries
  // ============================================================================

  getDashboardStats: async (): Promise<DashboardStats> => {
    // Get total products
    const productCountRes = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count FROM PRODUCTO
    `
    
    // Get active orders (pending + processing)
    const activeOrdersRes = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count 
      FROM ORDEN 
      WHERE estado_pedido IN ('PENDIENTE', 'PROCESANDO')
    `
    
    // Get low stock count
    const lowStockRes = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int as count
      FROM INVENTARIO i
      JOIN VARIANTE_PRODUCTO vp ON i.id_variante = vp.id_variante
      WHERE i.cantidad_stock <= i.stock_minimo
        AND (vp.variante_activa IS NULL OR vp.variante_activa = true)
    `
    
    // Get today's revenue
    const todayRevenueRes = await sql<{ revenue: string }[]>`
      SELECT COALESCE(SUM(total_orden), 0::money) as revenue
      FROM ORDEN 
      WHERE DATE(fecha_orden) = CURRENT_DATE
        AND estado_pedido != 'CANCELADO'
    `

    return {
      total_products: productCountRes[0]?.count || 0,
      active_orders: activeOrdersRes[0]?.count || 0,
      low_stock_count: lowStockRes[0]?.count || 0,
      today_revenue: todayRevenueRes[0]?.revenue || '$0.00'
    }
  },

  // ============================================================================
  // AUTHENTICATION QUERIES (Keep existing)
  // ============================================================================

  getUserByEmail: async (email: string): Promise<UserWithType | null> => {
    // First check if user exists in PERSONA table
    const personRes = await sql<Persona[]>`
      SELECT * FROM PERSONA WHERE LOWER(EMAIL) = LOWER(${email})
    `
    
    if (personRes.length === 0) return null
    
    const person = personRes[0]
    
    // Check if user is a CLIENTE
    const clienteRes = await sql<Cliente[]>`
      SELECT * FROM CLIENTE WHERE ID_CLIENTE = ${person.id_persona}
    `
    
    if (clienteRes.length > 0) {
      const cliente = clienteRes[0]
      return {
        ...person,
        user_type: 'cliente' as const,
        fecha_registro: cliente.fecha_registro,
        preferencias_newsletter: cliente.preferencias_newsletter
      }
    }
    
    // Check if user is an EMPLEADO
    const empleadoRes = await sql<Empleado[]>`
      SELECT * FROM EMPLEADO WHERE ID_EMPLEADO = ${person.id_persona} AND ESTADO_ACTIVO = true
    `
    
    if (empleadoRes.length > 0) {
      const empleado = empleadoRes[0]
      return {
        ...person,
        user_type: 'empleado' as const,
        cargo: empleado.cargo,
        salario: empleado.salario,
        fecha_contratacion: empleado.fecha_contratacion,
        estado_activo: empleado.estado_activo
      }
    }
    
    // User exists in PERSONA but not in CLIENTE or EMPLEADO
    return null
  },

  createAuthCode: async (email: string, code: string): Promise<void> => {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
    
    await sql`
      INSERT INTO AUTH_CODES (EMAIL, CODE, EXPIRES_AT, USED)
      VALUES (${email}, ${code}, ${expiresAt}, false)
    `
  },

  verifyAuthCode: async (email: string, code: string): Promise<boolean> => {
    const now = new Date()
    
    // Find valid, unused code that hasn't expired
    const codeRes = await sql<AuthCode[]>`
      SELECT * FROM AUTH_CODES 
      WHERE LOWER(EMAIL) = LOWER(${email}) 
        AND CODE = ${code} 
        AND USED = false 
        AND EXPIRES_AT > ${now}
      ORDER BY CREATED_AT DESC
      LIMIT 1
    `
    
    if (codeRes.length === 0) return false
    
    // Mark code as used
    await sql`
      UPDATE AUTH_CODES 
      SET USED = true 
      WHERE ID_AUTH_CODE = ${codeRes[0].id_auth_code}
    `
    
    return true
  },

  cleanupExpiredCodes: async (): Promise<void> => {
    const now = new Date()
    
    await sql`
      DELETE FROM AUTH_CODES 
      WHERE EXPIRES_AT < ${now} OR USED = true
    `
  },

  // Helper function to get AuthUser format
  getAuthUserFromUserWithType: (user: UserWithType): AuthUser => {
    return {
      id_persona: user.id_persona,
      email: user.email,
      user_type: user.user_type,
      nombre: user.nombre,
      apellido: user.apellido
    }
  },

  // ============================================================================
  // PRODUCT MANAGEMENT QUERIES
  // ============================================================================

  // Get all categories for form dropdowns
  getAllCategories: async (): Promise<Categoria[]> => {
    const res = await sql<Categoria[]>`
      SELECT * FROM CATEGORIA
      WHERE categoria_activa = true
      ORDER BY nombre_categoria
    `
    return res
  },

  // Get all brands for form dropdowns
  getAllBrands: async (): Promise<Marca[]> => {
    const res = await sql<Marca[]>`
      SELECT * FROM MARCA
      ORDER BY nombre_marca
    `
    return res
  },

  // Get all suppliers for form dropdowns
  getAllSuppliers: async (): Promise<Proveedor[]> => {
    const res = await sql<Proveedor[]>`
      SELECT * FROM PROVEEDOR
      ORDER BY nombre_empresa
    `
    return res
  },

  // Get single product by ID with full details
  getProductById: async (productId: number): Promise<ProductSearchResult | null> => {
    const res = await sql<ProductSearchResult[]>`
      SELECT 
        p.*,
        c.nombre_categoria,
        m.nombre_marca,
        pr.nombre_empresa as proveedor_nombre
      FROM PRODUCTO p
      LEFT JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
      LEFT JOIN MARCA m ON p.id_marca = m.id_marca
      LEFT JOIN PROVEEDOR pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = ${productId}
    `
    return res[0] || null
  },

  // Create new product
  createProduct: async (product: {
    nombre_producto: string
    descripcion: string
    precio: string
    precio_oferta?: string
    peso?: number
    material?: string
    id_categoria?: number
    id_marca: number
    id_proveedor: number
  }): Promise<Producto> => {
    const res = await sql<Producto[]>`
      INSERT INTO PRODUCTO (
        nombre_producto, descripcion, precio, precio_oferta, 
        peso, material, id_categoria, id_marca, id_proveedor
      )
      VALUES (
        ${product.nombre_producto}, ${product.descripcion}, ${product.precio}::money, 
        ${product.precio_oferta ? product.precio_oferta + '::money' : null}, 
        ${product.peso ?? null}, ${product.material ?? null}, ${product.id_categoria ?? null}, 
        ${product.id_marca}, ${product.id_proveedor}
      )
      RETURNING *
    `
    return res[0]
  },

  // Update existing product
  updateProduct: async (productId: number, updates: {
    nombre_producto?: string
    descripcion?: string
    precio?: string
    precio_oferta?: string
    peso?: number
    material?: string
    id_categoria?: number
    id_marca?: number
    id_proveedor?: number
  }): Promise<Producto> => {
    // For simplicity, we'll update all fields that are provided
    const res = await sql<Producto[]>`
      UPDATE PRODUCTO 
      SET 
        nombre_producto = COALESCE(${updates.nombre_producto ?? null}, nombre_producto),
        descripcion = COALESCE(${updates.descripcion ?? null}, descripcion),
        precio = COALESCE(${updates.precio ? updates.precio + '::money' : null}, precio),
        precio_oferta = ${updates.precio_oferta ? updates.precio_oferta + '::money' : 'precio_oferta'},
        peso = COALESCE(${updates.peso ?? null}, peso),
        material = COALESCE(${updates.material ?? null}, material),
        id_categoria = COALESCE(${updates.id_categoria ?? null}, id_categoria),
        id_marca = COALESCE(${updates.id_marca ?? null}, id_marca),
        id_proveedor = COALESCE(${updates.id_proveedor ?? null}, id_proveedor)
      WHERE id_producto = ${productId}
      RETURNING *
    `
    return res[0]
  },

  // Delete product (soft delete by checking if it has variants/orders)
  deleteProduct: async (productId: number): Promise<boolean> => {
    // Check if product has variants or orders
    const hasVariants = await sql`
      SELECT COUNT(*) as count FROM VARIANTE_PRODUCTO WHERE id_producto = ${productId}
    `
    
    if (parseInt(hasVariants[0].count) > 0) {
      throw new Error('Cannot delete product with existing variants')
    }

    const res = await sql`
      DELETE FROM PRODUCTO WHERE id_producto = ${productId}
    `
    return res.count > 0
  },

  // ============================================================================
  // INVENTORY MANAGEMENT QUERIES
  // ============================================================================

  // Adjust stock for a specific variant
  adjustVariantStock: async (variantId: number, adjustment: number, reason?: string): Promise<Inventario> => {
    // First check if inventory record exists
    const existingInventory = await sql<Inventario[]>`
      SELECT * FROM INVENTARIO WHERE id_variante = ${variantId}
    `

    if (existingInventory.length === 0) {
      // Create new inventory record if it doesn't exist
      const res = await sql<Inventario[]>`
        INSERT INTO INVENTARIO (id_variante, cantidad_stock, stock_minimo, stock_maximo, fecha_ultima_actualizacion)
        VALUES (${variantId}, GREATEST(0, ${adjustment}), 0, 100, CURRENT_DATE)
        RETURNING *
      `
      return res[0]
    } else {
      // Update existing inventory record
      const res = await sql<Inventario[]>`
        UPDATE INVENTARIO 
        SET 
          cantidad_stock = GREATEST(0, cantidad_stock + ${adjustment}),
          fecha_ultima_actualizacion = CURRENT_DATE
        WHERE id_variante = ${variantId}
        RETURNING *
      `
      return res[0]
    }
  },



  // Update product variant details
  updateProductVariant: async (variantId: number, updates: {
    precio_variante?: string
    sku?: string
    variante_activa?: boolean
  }): Promise<VarianteProducto> => {
    const res = await sql<VarianteProducto[]>`
      UPDATE VARIANTE_PRODUCTO 
      SET 
        precio_variante = COALESCE(${updates.precio_variante ? updates.precio_variante + '::money' : null}, precio_variante),
        sku = COALESCE(${updates.sku ?? null}, sku),
        variante_activa = COALESCE(${updates.variante_activa ?? null}, variante_activa)
      WHERE id_variante = ${variantId}
      RETURNING *
    `
    return res[0]
  },

  // ============================================================================
  // ORDER PROCESSING QUERIES
  // ============================================================================

  // Get order details with customer and products
  getOrderDetails: async (orderId: number): Promise<OrderWithCustomer & { products: any[] } | null> => {
    const orderRes = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email,
        p.telefono as customer_phone,
        p.direccion as customer_address
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      WHERE o.id_orden = ${orderId}
    `

    if (orderRes.length === 0) {
      return null
    }

    const order = orderRes[0]

    // Get order products
    const productsRes = await sql`
      SELECT 
        op.*,
        pr.nombre_producto,
        vp.sku,
        c.nombre_color,
        t.codigo_talla,
        t.descripcion_talla
      FROM ORDEN_PRODUCTO op
      JOIN VARIANTE_PRODUCTO vp ON op.id_variante = vp.id_variante
      JOIN PRODUCTO pr ON vp.id_producto = pr.id_producto
      JOIN COLOR c ON vp.id_color = c.id_color
      JOIN TALLA t ON vp.id_talla = t.id_talla
      WHERE op.id_orden = ${orderId}
    `

    return {
      ...order,
      products: productsRes
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: number, newStatus: string, estimatedDelivery?: Date, actualDelivery?: Date): Promise<OrderWithCustomer> => {
    // Update the order
    await sql`
      UPDATE ORDEN 
      SET 
        estado_pedido = ${newStatus},
        fecha_entrega_estimada = COALESCE(${estimatedDelivery ?? null}, fecha_entrega_estimada),
        fecha_entrega_real = COALESCE(${actualDelivery ?? null}, fecha_entrega_real)
      WHERE id_orden = ${orderId}
    `

    // Get updated order with customer info
    const orderWithCustomer = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      WHERE o.id_orden = ${orderId}
    `

    return orderWithCustomer[0]
  },

  // Get orders that need processing (status: Procesando)
  getOrdersToProcess: async (): Promise<OrderWithCustomer[]> => {
    const res = await sql<OrderWithCustomer[]>`
      SELECT 
        o.*,
        CONCAT(p.nombre, ' ', p.apellido) as customer_name,
        p.email as customer_email
      FROM ORDEN o
      JOIN PERSONA p ON o.id_persona = p.id_persona
      WHERE o.estado_pedido = 'Procesando'
      ORDER BY o.fecha_orden ASC
    `
    return res
  },

  // ============================================================================
  // REFERENCE DATA QUERIES (Colors, Sizes)
  // ============================================================================

  // Get all colors
  getAllColors: async (): Promise<Color[]> => {
    const res = await sql<Color[]>`
      SELECT * FROM COLOR
      ORDER BY nombre_color
    `
    return res
  },

  // Get all sizes
  getAllSizes: async (): Promise<Talla[]> => {
    const res = await sql<Talla[]>`
      SELECT * FROM TALLA
      ORDER BY equivalencia_numerica
    `
    return res
  },

  // ============================================================================
  // PRODUCT VARIANT CREATION
  // ============================================================================

  // Create product with variants
  createProductWithVariants: async (
    productData: {
      nombre_producto: string
      descripcion: string
      precio: string
      precio_oferta?: string
      peso?: number
      material?: string
      id_categoria?: number
      id_marca: number
      id_proveedor: number
    },
    variants: Array<{
      id_talla: number
      id_color: number
      sku?: string
      precio_variante?: string
      variante_activa?: boolean
    }>
  ): Promise<{ product: Producto; variants: VarianteProducto[] }> => {
    // Create the product first
    const productRes = await sql<Producto[]>`
      INSERT INTO PRODUCTO (
        nombre_producto, descripcion, precio, precio_oferta, peso, material, 
        id_categoria, id_marca, id_proveedor
      ) VALUES (
        ${productData.nombre_producto}, 
        ${productData.descripcion}, 
        ${productData.precio}::money,
        ${productData.precio_oferta ? sql`${productData.precio_oferta}::money` : null},
        ${productData.peso ?? null}, 
        ${productData.material ?? null},
        ${productData.id_categoria ?? null}, 
        ${productData.id_marca}, 
        ${productData.id_proveedor}
      )
      RETURNING *
    `

    const product = productRes[0]

    // Create variants if provided
    const createdVariants: VarianteProducto[] = []
    if (variants.length > 0) {
      for (const variant of variants) {
        const variantRes = await sql<VarianteProducto[]>`
          INSERT INTO VARIANTE_PRODUCTO (
            id_producto, id_talla, id_color, sku, precio_variante, variante_activa
          ) VALUES (
            ${product.id_producto}, 
            ${variant.id_talla}, 
            ${variant.id_color},
            ${variant.sku ?? null}, 
            ${variant.precio_variante ? sql`${variant.precio_variante}::money` : null},
            ${variant.variante_activa ?? true}
          )
          RETURNING *
        `
        createdVariants.push(variantRes[0])
      }
    }

    return { product, variants: createdVariants }
  }
}

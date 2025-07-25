import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { DB } from '@/server/db/queries.sql'

// Validation schemas
const searchProductsSchema = z.object({
  searchTerm: z.string().min(1).max(100)
})

const dateRangeSchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str))
})

const categoryFilterSchema = z.object({
  categoryIds: z.array(z.number()).min(1)
})

const statusFilterSchema = z.object({
  statuses: z.array(z.string()).min(1)
})

const paymentMethodSchema = z.object({
  paymentMethod: z.string().optional()
})

const limitSchema = z.object({
  limit: z.number().min(1).max(100).default(10)
})

const yearFilterSchema = z.object({
  year: z.number().optional()
})

// Order processing schemas
const orderIdSchema = z.object({
  orderId: z.number().min(1)
})

const updateOrderStatusSchema = z.object({
  orderId: z.number().min(1),
  status: z.string().min(1),
  estimatedDelivery: z.string().optional().transform(str => str ? new Date(str) : undefined),
  actualDelivery: z.string().optional().transform(str => str ? new Date(str) : undefined)
})

// Dashboard Statistics
export const getDashboardStats = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getDashboardStats()
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Failed to fetch dashboard statistics')
  }
})

// Product Management Actions
export const getProductsWithDetails = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getProductsWithDetails()
  } catch (error) {
    console.error('Error fetching products with details:', error)
    throw new Error('Failed to fetch products')
  }
})

export const searchProducts = createServerFn()
  .validator(searchProductsSchema)
  .handler(async ({ data }: { data: z.infer<typeof searchProductsSchema> }) => {
    try {
      return await DB.searchProductsByName(data.searchTerm)
    } catch (error) {
      console.error('Error searching products:', error)
      throw new Error('Failed to search products')
    }
  })

export const getProductsByCategories = createServerFn()
  .validator(categoryFilterSchema)
  .handler(async ({ data }: { data: z.infer<typeof categoryFilterSchema> }) => {
    try {
      return await DB.getProductsByCategories(data.categoryIds)
    } catch (error) {
      console.error('Error fetching products by categories:', error)
      throw new Error('Failed to fetch products by categories')
    }
  })

// Inventory Management Actions
const productIdSchema = z.object({ productId: z.number().optional() })

export const getProductVariantsWithDetails = createServerFn()
  .validator(productIdSchema)
  .handler(async ({ data }: { data: z.infer<typeof productIdSchema> }) => {
    try {
      return await DB.getProductVariantsWithDetails(data.productId)
    } catch (error) {
      console.error('Error fetching product variants:', error)
      throw new Error('Failed to fetch product variants')
    }
  })

export const getActiveProductsWithStock = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getActiveProductsWithStock()
  } catch (error) {
    console.error('Error fetching active products with stock:', error)
    throw new Error('Failed to fetch active products')
  }
})

export const getLowStockProducts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getLowStockProducts()
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    throw new Error('Failed to fetch low stock alerts')
  }
})

// Order Management Actions
export const getRecentOrders = createServerFn()
  .validator(limitSchema)
  .handler(async ({ data }: { data: z.infer<typeof limitSchema> }) => {
    try {
      return await DB.getRecentOrders(data.limit)
    } catch (error) {
      console.error('Error fetching recent orders:', error)
      throw new Error('Failed to fetch recent orders')
    }
  })

export const getOrdersByDateRange = createServerFn()
  .validator(dateRangeSchema)
  .handler(async ({ data }: { data: z.infer<typeof dateRangeSchema> }) => {
    try {
      return await DB.getOrdersByDateRange(data.startDate, data.endDate)
    } catch (error) {
      console.error('Error fetching orders by date range:', error)
      throw new Error('Failed to fetch orders by date range')
    }
  })

export const getOrdersByStatus = createServerFn()
  .validator(statusFilterSchema)
  .handler(async ({ data }: { data: z.infer<typeof statusFilterSchema> }) => {
    try {
      return await DB.getOrdersByStatus(data.statuses)
    } catch (error) {
      console.error('Error fetching orders by status:', error)
      throw new Error('Failed to fetch orders by status')
    }
  })

export const getOrdersByPaymentMethod = createServerFn()
  .validator(paymentMethodSchema)
  .handler(async ({ data }: { data: z.infer<typeof paymentMethodSchema> }) => {
    try {
      return await DB.getOrdersByPaymentMethod(data.paymentMethod)
    } catch (error) {
      console.error('Error fetching orders by payment method:', error)
      throw new Error('Failed to fetch orders by payment method')
    }
  })

// Analytics and Reports Actions
export const getSalesByProduct = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getSalesByProduct()
  } catch (error) {
    console.error('Error fetching sales by product:', error)
    throw new Error('Failed to fetch sales analytics')
  }
})

export const getAverageOrderValue = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getAverageOrderValue()
  } catch (error) {
    console.error('Error fetching average order value:', error)
    throw new Error('Failed to fetch average order value')
  }
})

export const getProductCountByCategory = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getProductCountByCategory()
  } catch (error) {
    console.error('Error fetching product count by category:', error)
    throw new Error('Failed to fetch category statistics')
  }
})

export const getMonthlySalesSummary = createServerFn()
  .validator(yearFilterSchema)
  .handler(async ({ data }: { data: z.infer<typeof yearFilterSchema> }) => {
    try {
      return await DB.getMonthlySalesSummary(data.year)
    } catch (error) {
      console.error('Error fetching monthly sales summary:', error)
      throw new Error('Failed to fetch monthly sales data')
    }
  })

export const getProductsNeverOrdered = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getProductsNeverOrdered()
  } catch (error) {
    console.error('Error fetching products never ordered:', error)
    throw new Error('Failed to fetch unused products')
  }
})

export const getTopCustomersByPurchaseAmount = createServerFn()
  .validator(limitSchema)
  .handler(async ({ data }: { data: z.infer<typeof limitSchema> }) => {
    try {
      return await DB.getTopCustomersByPurchaseAmount(data.limit)
    } catch (error) {
      console.error('Error fetching top customers:', error)
      throw new Error('Failed to fetch customer rankings')
    }
  })

export const getProductsAboveAveragePrice = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getProductsAboveAveragePrice()
  } catch (error) {
    console.error('Error fetching products above average price:', error)
    throw new Error('Failed to fetch premium products')
  }
})

// Supplier Management Actions
const countrySchema = z.object({ country: z.string().optional() })

export const getSuppliersByCountry = createServerFn()
  .validator(countrySchema)
  .handler(async ({ data }: { data: z.infer<typeof countrySchema> }) => {
    try {
      return await DB.getSuppliersByCountry(data.country)
    } catch (error) {
      console.error('Error fetching suppliers by country:', error)
      throw new Error('Failed to fetch suppliers')
    }
  })

// Product Management Actions
export const getAllCategories = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getAllCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
})

export const getAllBrands = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getAllBrands()
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw new Error('Failed to fetch brands')
  }
})

export const getAllSuppliers = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getAllSuppliers()
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    throw new Error('Failed to fetch suppliers')
  }
})

const productByIdSchema = z.object({
  productId: z.number()
})

export const getProductById = createServerFn()
  .validator(productByIdSchema)
  .handler(async ({ data }: { data: z.infer<typeof productByIdSchema> }) => {
    try {
      return await DB.getProductById(data.productId)
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      throw new Error('Failed to fetch product')
    }
  })

const createProductSchema = z.object({
  nombre_producto: z.string().min(1, 'Product name is required').max(100),
  descripcion: z.string().min(1, 'Description is required').max(255),
  precio: z.string().min(1, 'Price is required'),
  precio_oferta: z.string().optional(),
  peso: z.number().optional(),
  material: z.string().max(100).optional(),
  id_categoria: z.number().optional(),
  id_marca: z.number({ required_error: 'Brand is required' }),
  id_proveedor: z.number({ required_error: 'Supplier is required' })
})

export const createProduct = createServerFn()
  .validator(createProductSchema)
  .handler(async ({ data }: { data: z.infer<typeof createProductSchema> }) => {
    try {
      return await DB.createProduct(data)
    } catch (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }
  })

// Product with variants creation schema
const createProductWithVariantsSchema = z.object({
  product: createProductSchema,
  variants: z.array(z.object({
    id_talla: z.number(),
    id_color: z.number(),
    sku: z.string().optional(),
    precio_variante: z.string().optional(),
    variante_activa: z.boolean().optional().default(true)
  })).optional().default([])
})

export const createProductWithVariants = createServerFn()
  .validator(createProductWithVariantsSchema)
  .handler(async ({ data }: { data: z.infer<typeof createProductWithVariantsSchema> }) => {
    try {
      return await DB.createProductWithVariants(data.product, data.variants)
    } catch (error) {
      console.error('Error creating product with variants:', error)
      throw new Error('Failed to create product with variants')
    }
  })

// Reference data actions
export const getAllColors = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getAllColors()
  } catch (error) {
    console.error('Error fetching colors:', error)
    throw new Error('Failed to fetch colors')
  }
})

export const getAllSizes = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getAllSizes()
  } catch (error) {
    console.error('Error fetching sizes:', error)
    throw new Error('Failed to fetch sizes')
  }
})

const updateProductSchema = z.object({
  productId: z.number(),
  updates: z.object({
    nombre_producto: z.string().min(1).max(100).optional(),
    descripcion: z.string().min(1).max(255).optional(),
    precio: z.string().min(1).optional(),
    precio_oferta: z.string().optional(),
    peso: z.number().optional(),
    material: z.string().max(100).optional(),
    id_categoria: z.number().optional(),
    id_marca: z.number().optional(),
    id_proveedor: z.number().optional()
  })
})

export const updateProduct = createServerFn()
  .validator(updateProductSchema)
  .handler(async ({ data }: { data: z.infer<typeof updateProductSchema> }) => {
    try {
      return await DB.updateProduct(data.productId, data.updates)
    } catch (error) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }
  })

const deleteProductSchema = z.object({
  productId: z.number()
})

export const deleteProduct = createServerFn()
  .validator(deleteProductSchema)
  .handler(async ({ data }: { data: z.infer<typeof deleteProductSchema> }) => {
    try {
      const success = await DB.deleteProduct(data.productId)
      if (!success) {
        throw new Error('Product not found or could not be deleted')
      }
      return { success: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to delete product')
    }
  })

// ============================================================================
// INVENTORY MANAGEMENT ACTIONS
// ============================================================================

const stockAdjustmentSchema = z.object({
  variantId: z.number(),
  adjustment: z.number().int(),
  reason: z.string().optional()
})



const variantUpdateSchema = z.object({
  variantId: z.number(),
  updates: z.object({
    precio_variante: z.string().optional(),
    sku: z.string().optional(),
    variante_activa: z.boolean().optional()
  })
})

// Adjust stock for a specific variant (+ or -)
export const adjustVariantStock = createServerFn()
  .validator(stockAdjustmentSchema)
  .handler(async ({ data }: { data: z.infer<typeof stockAdjustmentSchema> }) => {
    try {
      return await DB.adjustVariantStock(data.variantId, data.adjustment, data.reason)
    } catch (error) {
      console.error('Error adjusting variant stock:', error)
      throw new Error('Failed to adjust stock')
    }
  })

// ============================================================================
// ORDER PROCESSING ACTIONS
// ============================================================================

// Get detailed order information
export const getOrderDetails = createServerFn()
  .validator(orderIdSchema)
  .handler(async ({ data }: { data: z.infer<typeof orderIdSchema> }) => {
    try {
      return await DB.getOrderDetails(data.orderId)
    } catch (error) {
      console.error('Error fetching order details:', error)
      throw new Error('Failed to fetch order details')
    }
  })

// Update order status
export const updateOrderStatus = createServerFn()
  .validator(updateOrderStatusSchema)
  .handler(async ({ data }: { data: z.infer<typeof updateOrderStatusSchema> }) => {
    try {
      return await DB.updateOrderStatus(
        data.orderId, 
        data.status, 
        data.estimatedDelivery, 
        data.actualDelivery
      )
    } catch (error) {
      console.error('Error updating order status:', error)
      throw new Error('Failed to update order status')
    }
  })

// Get orders that need processing
export const getOrdersToProcess = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await DB.getOrdersToProcess()
  } catch (error) {
    console.error('Error fetching orders to process:', error)
    throw new Error('Failed to fetch orders to process')
  }
})



// Update product variant details
export const updateProductVariant = createServerFn()
  .validator(variantUpdateSchema)
  .handler(async ({ data }: { data: z.infer<typeof variantUpdateSchema> }) => {
    try {
      return await DB.updateProductVariant(data.variantId, data.updates)
    } catch (error) {
      console.error('Error updating product variant:', error)
      throw new Error('Failed to update product variant')
    }
  }) 
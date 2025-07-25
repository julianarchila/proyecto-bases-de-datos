import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDashboardStats,
  getProductsWithDetails,
  searchProducts,
  getProductsByCategories,
  getProductVariantsWithDetails,
  getActiveProductsWithStock,
  getLowStockProducts,
  getRecentOrders,
  getOrdersByDateRange,
  getOrdersByStatus,
  getOrdersByPaymentMethod,
  getSalesByProduct,
  getAverageOrderValue,
  getProductCountByCategory,
  getMonthlySalesSummary,
  getProductsNeverOrdered,
  getTopCustomersByPurchaseAmount,
  getProductsAboveAveragePrice,
  getSuppliersByCountry,
  getAllCategories,
  getAllBrands,
  getAllSuppliers,
  getAllColors,
  getAllSizes,
  getProductById,
  createProduct,
  createProductWithVariants,
  updateProduct,
  deleteProduct,
  adjustVariantStock,
  updateProductVariant,
  getOrderDetails,
  updateOrderStatus,
  getOrdersToProcess
} from '@/server/dashboard/actions'

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  products: () => [...dashboardKeys.all, 'products'] as const,
  productList: () => [...dashboardKeys.products(), 'list'] as const,
  productSearch: (searchTerm: string) => [...dashboardKeys.products(), 'search', searchTerm] as const,
  productsByCategory: (categoryIds: number[]) => [...dashboardKeys.products(), 'category', categoryIds] as const,
  productVariants: (productId?: number) => [...dashboardKeys.products(), 'variants', productId] as const,
  inventory: () => [...dashboardKeys.all, 'inventory'] as const,
  activeProducts: () => [...dashboardKeys.inventory(), 'active'] as const,
  lowStock: () => [...dashboardKeys.inventory(), 'low-stock'] as const,
  orders: () => [...dashboardKeys.all, 'orders'] as const,
  recentOrders: (limit: number) => [...dashboardKeys.orders(), 'recent', limit] as const,
  ordersByDateRange: (startDate: string, endDate: string) => [...dashboardKeys.orders(), 'date-range', startDate, endDate] as const,
  ordersByStatus: (statuses: string[]) => [...dashboardKeys.orders(), 'status', statuses] as const,
  ordersByPayment: (paymentMethod?: string) => [...dashboardKeys.orders(), 'payment', paymentMethod] as const,
  analytics: () => [...dashboardKeys.all, 'analytics'] as const,
  salesByProduct: () => [...dashboardKeys.analytics(), 'sales-by-product'] as const,
  averageOrderValue: () => [...dashboardKeys.analytics(), 'average-order-value'] as const,
  categoryStats: () => [...dashboardKeys.analytics(), 'category-stats'] as const,
  monthlySales: (year?: number) => [...dashboardKeys.analytics(), 'monthly-sales', year] as const,
  unusedProducts: () => [...dashboardKeys.analytics(), 'unused-products'] as const,
  topCustomers: (limit: number) => [...dashboardKeys.analytics(), 'top-customers', limit] as const,
  premiumProducts: () => [...dashboardKeys.analytics(), 'premium-products'] as const,
  suppliers: () => [...dashboardKeys.all, 'suppliers'] as const,
  suppliersByCountry: (country?: string) => [...dashboardKeys.suppliers(), 'country', country] as const,
  // Product management keys
  productManagement: () => [...dashboardKeys.all, 'product-management'] as const,
  categories: () => [...dashboardKeys.productManagement(), 'categories'] as const,
  brands: () => [...dashboardKeys.productManagement(), 'brands'] as const,
  allSuppliers: () => [...dashboardKeys.productManagement(), 'all-suppliers'] as const,
  colors: () => [...dashboardKeys.productManagement(), 'colors'] as const,
  sizes: () => [...dashboardKeys.productManagement(), 'sizes'] as const,
  productById: (productId: number) => [...dashboardKeys.products(), 'by-id', productId] as const,
  // Order processing keys
  orderDetails: (orderId: number) => [...dashboardKeys.orders(), 'details', orderId] as const,
  ordersToProcess: () => [...dashboardKeys.orders(), 'to-process'] as const,
}

// Dashboard Statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Product Management Hooks
export function useProductsWithDetails() {
  return useQuery({
    queryKey: dashboardKeys.productList(),
    queryFn: () => getProductsWithDetails(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: dashboardKeys.productSearch(searchTerm),
    queryFn: () => searchProducts({ data: { searchTerm } }),
    enabled: searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useProductsByCategories(categoryIds: number[]) {
  return useQuery({
    queryKey: dashboardKeys.productsByCategory(categoryIds),
    queryFn: () => getProductsByCategories({ data: { categoryIds } }),
    enabled: categoryIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useProductVariantsWithDetails(productId?: number) {
  return useQuery({
    queryKey: dashboardKeys.productVariants(productId),
    queryFn: () => getProductVariantsWithDetails({ data: { productId } }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Inventory Management Hooks
export function useActiveProductsWithStock() {
  return useQuery({
    queryKey: dashboardKeys.activeProducts(),
    queryFn: () => getActiveProductsWithStock(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: dashboardKeys.lowStock(),
    queryFn: () => getLowStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Order Management Hooks
export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(limit),
    queryFn: () => getRecentOrders({ data: { limit } }),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useOrdersByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: dashboardKeys.ordersByDateRange(startDate, endDate),
    queryFn: () => getOrdersByDateRange({ data: { startDate, endDate } }),
    enabled: Boolean(startDate && endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useOrdersByStatus(statuses: string[]) {
  return useQuery({
    queryKey: dashboardKeys.ordersByStatus(statuses),
    queryFn: () => getOrdersByStatus({ data: { statuses } }),
    enabled: statuses.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useOrdersByPaymentMethod(paymentMethod?: string) {
  return useQuery({
    queryKey: dashboardKeys.ordersByPayment(paymentMethod),
    queryFn: () => getOrdersByPaymentMethod({ data: { paymentMethod } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Analytics and Reports Hooks
export function useSalesByProduct() {
  return useQuery({
    queryKey: dashboardKeys.salesByProduct(),
    queryFn: () => getSalesByProduct(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAverageOrderValue() {
  return useQuery({
    queryKey: dashboardKeys.averageOrderValue(),
    queryFn: () => getAverageOrderValue(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProductCountByCategory() {
  return useQuery({
    queryKey: dashboardKeys.categoryStats(),
    queryFn: () => getProductCountByCategory(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useMonthlySalesSummary(year?: number) {
  return useQuery({
    queryKey: dashboardKeys.monthlySales(year),
    queryFn: () => getMonthlySalesSummary({ data: { year } }),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useProductsNeverOrdered() {
  return useQuery({
    queryKey: dashboardKeys.unusedProducts(),
    queryFn: () => getProductsNeverOrdered(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useTopCustomersByPurchaseAmount(limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.topCustomers(limit),
    queryFn: () => getTopCustomersByPurchaseAmount({ data: { limit } }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useProductsAboveAveragePrice() {
  return useQuery({
    queryKey: dashboardKeys.premiumProducts(),
    queryFn: () => getProductsAboveAveragePrice(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Supplier Management Hooks
export function useSuppliersByCountry(country?: string) {
  return useQuery({
    queryKey: dashboardKeys.suppliersByCountry(country),
    queryFn: () => getSuppliersByCountry({ data: { country } }),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Compound Hooks for Common Operations
export function useDashboardOverview() {
  const stats = useDashboardStats()
  const recentOrders = useRecentOrders(5)
  const lowStock = useLowStockProducts()
  
  return {
    stats: stats.data,
    recentOrders: recentOrders.data,
    lowStockCount: lowStock.data?.length || 0,
    isLoading: stats.isLoading || recentOrders.isLoading || lowStock.isLoading,
    error: stats.error || recentOrders.error || lowStock.error,
    refetch: () => {
      stats.refetch()
      recentOrders.refetch()
      lowStock.refetch()
    }
  }
}

// ============================================================================
// ORDER PROCESSING HOOKS
// ============================================================================

// Get detailed order information
export function useOrderDetails(orderId: number) {
  return useQuery({
    queryKey: dashboardKeys.orderDetails(orderId),
    queryFn: () => getOrderDetails({ data: { orderId } }),
    enabled: Boolean(orderId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get orders that need processing
export function useOrdersToProcess() {
  return useQuery({
    queryKey: dashboardKeys.ordersToProcess(),
    queryFn: () => getOrdersToProcess(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Update order status mutation
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (updatedOrder) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: dashboardKeys.orders() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.ordersToProcess() })
      if (updatedOrder?.id_orden) {
        queryClient.invalidateQueries({ queryKey: dashboardKeys.orderDetails(updatedOrder.id_orden) })
      }
    },
  })
}

// Compound hook for order processing operations
export function useOrderProcessing(orderId?: number) {
  const orderDetails = useOrderDetails(orderId!)
  const updateStatus = useUpdateOrderStatus()
  const ordersToProcess = useOrdersToProcess()
  
  return {
    orderDetails: orderDetails.data,
    ordersToProcess: ordersToProcess.data,
    isLoadingDetails: orderDetails.isLoading,
    isLoadingToProcess: ordersToProcess.isLoading,
    updateStatus: updateStatus.mutate,
    isUpdating: updateStatus.isPending,
    error: orderDetails.error || ordersToProcess.error || updateStatus.error,
    refetch: () => {
      if (orderId) orderDetails.refetch()
      ordersToProcess.refetch()
    }
  }
}

export function useInventoryOverview() {
  const activeProducts = useActiveProductsWithStock()
  const lowStock = useLowStockProducts()
  const categoryStats = useProductCountByCategory()
  
  return {
    activeProducts: activeProducts.data,
    lowStockProducts: lowStock.data,
    categoryStats: categoryStats.data,
    isLoading: activeProducts.isLoading || lowStock.isLoading || categoryStats.isLoading,
    error: activeProducts.error || lowStock.error || categoryStats.error,
    refetch: () => {
      activeProducts.refetch()
      lowStock.refetch()
      categoryStats.refetch()
    }
  }
}

export function useAnalyticsOverview() {
  const salesByProduct = useSalesByProduct()
  const averageOrderValue = useAverageOrderValue()
  const monthlySales = useMonthlySalesSummary(new Date().getFullYear())
  const topCustomers = useTopCustomersByPurchaseAmount(5)
  
  return {
    salesByProduct: salesByProduct.data,
    averageOrderValue: averageOrderValue.data,
    monthlySales: monthlySales.data,
    topCustomers: topCustomers.data,
    isLoading: salesByProduct.isLoading || averageOrderValue.isLoading || monthlySales.isLoading || topCustomers.isLoading,
    error: salesByProduct.error || averageOrderValue.error || monthlySales.error || topCustomers.error,
    refetch: () => {
      salesByProduct.refetch()
      averageOrderValue.refetch()
      monthlySales.refetch()
      topCustomers.refetch()
    }
  }
}

// Product Management Hooks
export function useAllCategories() {
  return useQuery({
    queryKey: dashboardKeys.categories(),
    queryFn: () => getAllCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useAllBrands() {
  return useQuery({
    queryKey: dashboardKeys.brands(),
    queryFn: () => getAllBrands(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useAllSuppliers() {
  return useQuery({
    queryKey: dashboardKeys.allSuppliers(),
    queryFn: () => getAllSuppliers(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useAllColors() {
  return useQuery({
    queryKey: dashboardKeys.colors(),
    queryFn: () => getAllColors(),
    staleTime: 60 * 60 * 1000, // 1 hour - colors don't change often
  })
}

export function useAllSizes() {
  return useQuery({
    queryKey: dashboardKeys.sizes(),
    queryFn: () => getAllSizes(),
    staleTime: 60 * 60 * 1000, // 1 hour - sizes don't change often
  })
}

export function useProductById(productId: number) {
  return useQuery({
    queryKey: dashboardKeys.productById(productId),
    queryFn: () => getProductById({ data: { productId } }),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Product Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productData: {
      nombre_producto: string
      descripcion: string
      precio: string
      precio_oferta?: string
      peso?: number
      material?: string
      id_categoria?: number
      id_marca: number
      id_proveedor: number
    }) => createProduct({ data: productData }),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productList() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
    },
  })
}

export function useCreateProductWithVariants() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: {
      product: {
        nombre_producto: string
        descripcion: string
        precio: string
        precio_oferta?: string
        peso?: number
        material?: string
        id_categoria?: number
        id_marca: number
        id_proveedor: number
      }
      variants: Array<{
        id_talla: number
        id_color: number
        sku?: string
        precio_variante?: string
        variante_activa?: boolean
      }>
    }) => createProductWithVariants({ data }),
    onSuccess: () => {
      // Invalidate and refetch products list and variants
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productList() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productVariants() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.inventory() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, updates }: {
      productId: number
      updates: {
        nombre_producto?: string
        descripcion?: string
        precio?: string
        precio_oferta?: string
        peso?: number
        material?: string
        id_categoria?: number
        id_marca?: number
        id_proveedor?: number
      }
    }) => updateProduct({ data: { productId, updates } }),
    onSuccess: (_, variables) => {
      // Invalidate and refetch products list and specific product
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productList() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productById(variables.productId) })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productId: number) => deleteProduct({ data: { productId } }),
    onSuccess: (_, productId) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productList() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productById(productId) })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
    },
  })
} 

// ============================================================================
// INVENTORY MANAGEMENT HOOKS
// ============================================================================

// Adjust stock for a specific variant (+ or -)
export function useAdjustVariantStock() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ variantId, adjustment, reason }: {
      variantId: number
      adjustment: number
      reason?: string
    }) => adjustVariantStock({ data: { variantId, adjustment, reason } }),
    onSuccess: () => {
      // Invalidate inventory-related queries
      queryClient.invalidateQueries({ queryKey: dashboardKeys.inventory() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productVariants() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() })
    },
  })
}



// Update product variant details
export function useUpdateProductVariant() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ variantId, updates }: {
      variantId: number
      updates: {
        precio_variante?: string
        sku?: string
        variante_activa?: boolean
      }
    }) => updateProductVariant({ data: { variantId, updates } }),
    onSuccess: () => {
      // Invalidate product and inventory queries
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productVariants() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.inventory() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.productList() })
    },
  })
}

// Compound hook for quick stock adjustments (common pattern)
export function useQuickStockActions() {
  const adjustStock = useAdjustVariantStock()
  
  return {
    increaseStock: (variantId: number, amount: number = 1) => {
      adjustStock.mutate({ variantId, adjustment: amount, reason: 'Manual increase' })
    },
    decreaseStock: (variantId: number, amount: number = 1) => {
      adjustStock.mutate({ variantId, adjustment: -amount, reason: 'Manual decrease' })
    },
    isPending: adjustStock.isPending,
    error: adjustStock.error,
  }
} 
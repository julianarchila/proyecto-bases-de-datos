# Proyecto Final – Sistema de Gestión de Inventario y ventas para tienda de ropa en línea  
Universidad Nacional de Colombia – 2025

---
[Documento](https://docs.google.com/document/d/1pqFbGxinXTQlFdL65Pq-G0tEvYHOvV4_Q2GgWfsFOQI/edit?usp=sharing)
---

## 📦 Entidades y Atributos


- **Producto**: id, nombre, descripción, categoría, precio_base, fecha_agregado, estado  
- **VarianteProducto**: id, talla, color, sku, precio_final  
- **Inventario**: id, cantidad_disponible, ubicacion_bodega  
- **Cliente**: id, nombre, correo, teléfono, dirección_envío, ciudad, fecha_registro  
- **Pedido**: id, fecha_pedido, estado, total  
- **DetallePedido**: id, cantidad, precio_unitario  
- **Proveedor**: id, nombre, correo, teléfono, dirección, ciudad, fecha_registro  
- **Compra**: id, fecha_compra, total  
- **DetalleCompra**: id, cantidad, precio_compra

---

## 🔗 Relaciones

- Un producto tiene muchas variantes  
- Una variante pertenece a un único producto  
- Una variante aparece en muchos pedidos  
- Un pedido puede tener muchas variantes  
- Un cliente puede hacer muchos pedidos  
- Una variante tiene un único registro en inventario  
- Un proveedor puede registrar muchas compras  
- Una compra puede incluir muchas variantes

---

## 📋 Matriz 1 


|                        | Producto | VarianteProducto | Inventario | Cliente | Pedido | DetallePedido | Proveedor | Compra | DetalleCompra |
|------------------------|----------|------------------|------------|---------|--------|----------------|-----------|--------|----------------|
| **Producto**           | —        | ✔️               |            |         |        |                |           |        |                |
| **VarianteProducto**   | ✔️       | —                | ✔️         |         | ✔️     | ✔️             |           | ✔️     | ✔️             |
| **Inventario**         |          | ✔️               | —          |         |        |                |           |        |                |
| **Cliente**            |          |                  |            | —       | ✔️     |                |           |        |                |
| **Pedido**             |          | ✔️               |            | ✔️      | —      | ✔️             |           |        |                |
| **DetallePedido**      |          | ✔️               |            |         | ✔️     | —              |           |        |                |
| **Proveedor**          |          |                  |            |         |        |                | —         | ✔️     |                |
| **Compra**             |          | ✔️               |            |         |        |                | ✔️        | —      | ✔️             |
| **DetalleCompra**      |          | ✔️               |            |         |        |                |           | ✔️     | —              |

---

## 🔁 Matriz 2 

|                      | Producto | VarianteProducto | Inventario | Cliente | Pedido | DetallePedido | Proveedor | Compra | DetalleCompra |
| -------------------- | -------- | ---------------- | ---------- | ------- | ------ | ------------- | --------- | ------ | ------------- |
| **Producto**         | –        | 1-n              | –          | –       | –      | –             | –         | –      | –             |
| **VarianteProducto** | n-1      | –                | 1-1        | –       | n-1    | n-1           | –         | n-1    | n-1           |
| **Inventario**       | –        | n-1              | –          | –       | –      | –             | –         | –      | –             |
| **Cliente**          | –        | –                | –          | –       | 1-n    | –             | –         | –      | –             |
| **Pedido**           | –        | 1-n              | –          | n-1     | –      | 1-n           | –         | –      | –             |
| **DetallePedido**    | –        | 1                | –          | –       | n-1    | –             | –         | –      | –             |
| **Proveedor**        | –        | –                | –          | –       | –      | –             | –         | 1-n    | –             |
| **Compra**           | –        | 1-n              | –          | –       | –      | –             | n-1       | –      | 1-n           |
| **DetalleCompra**    | –        | 1                | –          | –       | –      | –             | –         | n-1    | –             |

---

## 🔗 Matriz 3: Cardinalidad final

|                      | Producto | VarianteProducto | Inventario | Cliente | Pedido | DetallePedido | Proveedor | Compra | DetalleCompra |
| -------------------- | -------- | ---------------- | ---------- | ------- | ------ | ------------- | --------- | ------ | ------------- |
| **Producto**         | —        | 1-n              | –          | –       | –      | –             | –         | –      | –             |
| **VarianteProducto** | 1-n      | —                | 1-1        | –       | n-m    | n-m           | –         | n-m    | n-m           |
| **Inventario**       | –        | 1-1              | —          | –       | –      | –             | –         | –      | –             |
| **Cliente**          | –        | –                | –          | —       | 1-n    | –             | –         | –      | –             |
| **Pedido**           | –        | n-m              | –          | 1-n     | —      | 1-n           | –         | –      | –             |
| **DetallePedido**    | –        | n-m              | –          | –       | 1-n    | —             | –         | –      | –             |
| **Proveedor**        | –        | –                | –          | –       | –      | –             | —         | 1-n    | –             |
| **Compra**           | –        | n-m              | –          | –       | –      | –             | 1-n       | —      | 1-n           |
| **DetalleCompra**    | –        | n-m              | –          | –       | –      | –             | –         | 1-n    | —             |


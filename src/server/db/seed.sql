-- Limpiar datos existentes (en orden inverso por dependencias)
DELETE FROM ORDEN_PRODUCTO;
DELETE FROM INVENTARIO;
DELETE FROM VARIANTE_PRODUCTO;
DELETE FROM ORDEN;
DELETE FROM PRODUCTO;
DELETE FROM CLIENTE;
DELETE FROM EMPLEADO;
DELETE FROM PERSONA;
DELETE FROM CATEGORIA;
DELETE FROM COLOR;
DELETE FROM TALLA;
DELETE FROM MARCA;
DELETE FROM PROVEEDOR;
DELETE FROM AUTH_CODES;

-- Reiniciar secuencias
ALTER SEQUENCE categoria_id_categoria_seq RESTART WITH 1;
ALTER SEQUENCE color_id_color_seq RESTART WITH 1;
ALTER SEQUENCE talla_id_talla_seq RESTART WITH 1;
ALTER SEQUENCE marca_id_marca_seq RESTART WITH 1;
ALTER SEQUENCE proveedor_id_proveedor_seq RESTART WITH 1;
ALTER SEQUENCE persona_id_persona_seq RESTART WITH 1;
ALTER SEQUENCE producto_id_producto_seq RESTART WITH 1;
ALTER SEQUENCE variante_producto_id_variante_seq RESTART WITH 1;
ALTER SEQUENCE orden_id_orden_seq RESTART WITH 1;
ALTER SEQUENCE inventario_id_inventario_seq RESTART WITH 1;
ALTER SEQUENCE auth_codes_id_auth_code_seq RESTART WITH 1;

-- ====================================
-- CATEGORÍAS
-- ====================================
INSERT INTO CATEGORIA (NOMBRE_CATEGORIA, CATEGORIA_ACTIVA, DESCRIPCION_CATEGORIA) VALUES
('Ropa Masculina', true, 'Prendas de vestir para hombres'),
('Ropa Femenina', true, 'Prendas de vestir para mujeres'),
('Calzado', true, 'Zapatos y sandalias para toda la familia'),
('Accesorios', true, 'Complementos de moda y accesorios'),
('Ropa Deportiva', true, 'Prendas para actividades deportivas'),
('Ropa Infantil', true, 'Ropa para niños y niñas'),
('Ropa Interior', true, 'Lencería y ropa interior'),
('Trajes de Baño', true, 'Vestidos de baño y ropa playera');

-- ====================================
-- COLORES
-- ====================================
INSERT INTO COLOR (NOMBRE_COLOR, CODIGO_HEX, DESCRIPCION_COLOR) VALUES
('Negro', '#000000', 'Color negro clásico'),
('Blanco', '#FFFFFF', 'Color blanco puro'),
('Azul Marino', '#000080', 'Azul oscuro elegante'),
('Rojo', '#FF0000', 'Rojo vibrante'),
('Verde', '#008000', 'Verde natural'),
('Amarillo', '#FFFF00', 'Amarillo brillante'),
('Rosa', '#FFC0CB', 'Rosa suave'),
('Gris', '#808080', 'Gris neutro'),
('Marrón', '#A52A2A', 'Marrón chocolate'),
('Beige', '#F5F5DC', 'Beige claro'),
('Azul Claro', '#87CEEB', 'Azul cielo'),
('Verde Oliva', '#808000', 'Verde militar');

-- ====================================
-- TALLAS
-- ====================================
INSERT INTO TALLA (CODIGO_TALLA, DESCRIPCION_TALLA, EQUIVALENCIA_NUMERICA) VALUES
('XS', 'Extra Pequeña', 1),
('S', 'Pequeña', 2),
('M', 'Mediana', 3),
('L', 'Grande', 4),
('XL', 'Extra Grande', 5),
('XXL', '2X Grande', 6),
('35', 'Talla 35 Calzado', 35),
('36', 'Talla 36 Calzado', 36),
('37', 'Talla 37 Calzado', 37),
('38', 'Talla 38 Calzado', 38),
('39', 'Talla 39 Calzado', 39),
('40', 'Talla 40 Calzado', 40),
('41', 'Talla 41 Calzado', 41),
('42', 'Talla 42 Calzado', 42),
('43', 'Talla 43 Calzado', 43),
('44', 'Talla 44 Calzado', 44);

-- ====================================
-- MARCAS
-- ====================================
INSERT INTO MARCA (NOMBRE_MARCA, DESCRIPCION_MARCA, PAIS_ORIGEN, WEBSITE) VALUES
('Arturo Calle', 'Marca colombiana de ropa masculina elegante', 'Colombia', 'www.arturocalle.com'),
('Studio F', 'Moda femenina colombiana contemporánea', 'Colombia', 'www.studiof.com.co'),
('Vélez', 'Cuero y marroquinería colombiana de alta calidad', 'Colombia', 'www.velez.com.co'),
('Tennis', 'Calzado deportivo y casual colombiano', 'Colombia', 'www.tennis.com.co'),
('Gef', 'Ropa casual y urbana colombiana', 'Colombia', 'www.gef.com.co'),
('Leonisa', 'Lencería y ropa interior femenina', 'Colombia', 'www.leonisa.com'),
('Chevignon', 'Marca francesa de ropa casual', 'Francia', 'www.chevignon.com'),
('Adidas', 'Marca alemana de ropa deportiva', 'Alemania', 'www.adidas.com'),
('Nike', 'Marca estadounidense de ropa deportiva', 'Estados Unidos', 'www.nike.com'),
('Zara', 'Moda española contemporánea', 'España', 'www.zara.com');

-- ====================================
-- PROVEEDORES
-- ====================================
INSERT INTO PROVEEDOR (NOMBRE_EMPRESA, EMAIL_PROVEEDOR, TELEFONO_PROVEEDOR, DIRECCION_PROVEEDOR, CIUDAD, PAIS) VALUES
('Textiles Medellín S.A.S', 'ventas@textilesmedellin.com.co', '+57 4 444-5555', 'Carrera 50 #45-67', 'Medellín', 'Colombia'),
('Confecciones Bogotá Ltda', 'comercial@confeccionesbogota.com.co', '+57 1 555-6666', 'Calle 26 #68-45', 'Bogotá', 'Colombia'),
('Industrias Textiles del Valle', 'info@textilesvalle.com.co', '+57 2 333-4444', 'Avenida 6N #28-45', 'Cali', 'Colombia'),
('Moda y Estilo S.A.S', 'pedidos@modayestilo.com.co', '+57 5 222-3333', 'Carrera 54 #72-33', 'Barranquilla', 'Colombia'),
('Cueros y Marroquinería Nacional', 'ventas@cuerosmarroquineria.com.co', '+57 4 777-8888', 'Calle 33 #70-25', 'Medellín', 'Colombia'),
('Distribuidora Deportiva Colombia', 'info@deportivacolombia.com.co', '+57 1 666-7777', 'Carrera 15 #93-47', 'Bogotá', 'Colombia');

-- ====================================
-- PERSONAS
-- ====================================
INSERT INTO PERSONA (NOMBRE, APELLIDO, EMAIL, TELEFONO, DIRECCION, FECHA_NACIMIENTO) VALUES
-- Empleados
('Carlos Andrés', 'Rodríguez García', 'carlos.rodriguez@empresa.com.co', '+57 300 123-4567', 'Carrera 11 #85-32, Apto 501', '1985-03-15'),
('María Fernanda', 'López Herrera', 'maria.lopez@empresa.com.co', '+57 301 234-5678', 'Calle 127 #15-45, Casa 12', '1990-07-22'),
('Juan Pablo', 'Martínez Sánchez', 'juan.martinez@empresa.com.co', '+57 302 345-6789', 'Carrera 7 #32-18, Apto 302', '1988-11-08'),
('Ana Lucía', 'Gómez Ramírez', 'ana.gomez@empresa.com.co', '+57 303 456-7890', 'Calle 85 #11-67, Casa 8', '1992-01-30'),
('Diego Alejandro', 'Vargas Moreno', 'diego.vargas@empresa.com.co', '+57 304 567-8901', 'Carrera 13 #76-23, Apto 201', '1987-09-12'),
('Julián', 'García López', 'julian@abc.com', '+57 305 678-9012', 'Carrera 14 #92-15, Apto 603', '1990-06-15'),

-- Clientes
('Sofía', 'Hernández Castro', 'sofia.hernandez@gmail.com', '+57 310 111-2222', 'Calle 116 #9-45, Apto 801', '1995-05-18'),
('Alejandro', 'Ruiz Jiménez', 'alejandro.ruiz@hotmail.com', '+57 311 222-3333', 'Carrera 15 #85-67, Casa 15', '1983-12-03'),
('Valentina', 'Torres Delgado', 'valentina.torres@yahoo.com', '+57 312 333-4444', 'Calle 72 #11-89, Apto 402', '1998-08-25'),
('Sebastián', 'Morales Peña', 'sebastian.morales@gmail.com', '+57 313 444-5555', 'Carrera 9 #116-34, Casa 22', '1991-04-14'),
('Isabella', 'Ramírez Vega', 'isabella.ramirez@outlook.com', '+57 314 555-6666', 'Calle 134 #7-56, Apto 603', '1996-10-07'),
('Mateo', 'Silva Cortés', 'mateo.silva@gmail.com', '+57 315 666-7777', 'Carrera 19 #93-12, Casa 9', '1989-02-28'),
('Camila', 'Pineda Rojas', 'camila.pineda@hotmail.com', '+57 316 777-8888', 'Calle 100 #15-78, Apto 505', '1994-06-19'),
('Daniel', 'Ospina Muñoz', 'daniel.ospina@yahoo.com', '+57 317 888-9999', 'Carrera 11 #127-45, Casa 18', '1986-11-23'),
('Valeria', 'Cardona Suárez', 'valeria.cardona@gmail.com', '+57 318 999-0000', 'Calle 147 #9-23, Apto 702', '1997-03-11'),
('Nicolás', 'Mendoza Ríos', 'nicolas.mendoza@outlook.com', '+57 319 000-1111', 'Carrera 7 #140-67, Casa 25', '1993-09-05');

-- ====================================
-- EMPLEADOS
-- ====================================
INSERT INTO EMPLEADO (ID_EMPLEADO, CARGO, SALARIO, FECHA_CONTRATACION, ESTADO_ACTIVO) VALUES
(1, 'Gerente General', '$4500000', '2020-01-15', true),
(2, 'Jefe de Ventas', '$3200000', '2021-03-20', true),
(3, 'Vendedor Senior', '$2800000', '2021-08-10', true),
(4, 'Coordinadora de Inventario', '$2500000', '2022-02-14', true),
(5, 'Vendedor', '$2200000', '2022-11-01', true),
(6, 'Desarrollador', '$3500000', '2023-01-10', true);

-- ====================================
-- CLIENTES
-- ====================================
INSERT INTO CLIENTE (ID_CLIENTE, FECHA_REGISTRO, PREFERENCIAS_NEWSLETTER) VALUES
(7, '2023-01-15', true),
(8, '2023-02-20', false),
(9, '2023-03-10', true),
(10, '2023-04-05', true),
(11, '2023-05-12', false),
(12, '2023-06-18', true),
(13, '2023-07-22', true),
(14, '2023-08-30', false),
(15, '2023-09-14', true),
(16, '2023-10-08', true);

-- ====================================
-- PRODUCTOS
-- ====================================
INSERT INTO PRODUCTO (ID_CATEGORIA, ID_MARCA, ID_PROVEEDOR, NOMBRE_PRODUCTO, DESCRIPCION, PRECIO, PRECIO_OFERTA, PESO, MATERIAL) VALUES
-- Ropa Masculina
(1, 1, 1, 'Camisa Formal Blanca', 'Camisa de vestir manga larga en algodón premium', '$89000', '$75000', 0.3, 'Algodón 100%'),
(1, 1, 1, 'Pantalón de Vestir Negro', 'Pantalón formal en paño de lana', '$120000', null, 0.8, 'Lana 70%, Poliéster 30%'),
(1, 7, 2, 'Chaqueta Casual', 'Chaqueta deportiva en algodón', '$150000', '$120000', 0.6, 'Algodón 80%, Poliéster 20%'),

-- Ropa Femenina
(2, 2, 2, 'Blusa Elegante', 'Blusa en seda con detalles bordados', '$95000', null, 0.2, 'Seda 100%'),
(2, 2, 2, 'Vestido Casual', 'Vestido midi en tela jersey', '$110000', '$95000', 0.4, 'Viscosa 95%, Elastano 5%'),
(2, 10, 3, 'Falda Plisada', 'Falda midi con pliegues', '$75000', null, 0.3, 'Poliéster 100%'),

-- Calzado
(3, 4, 6, 'Tenis Deportivos', 'Tenis para correr con tecnología de amortiguación', '$180000', '$160000', 0.8, 'Sintético, Malla'),
(3, 3, 5, 'Zapatos de Cuero', 'Zapatos formales en cuero genuino', '$220000', null, 1.0, 'Cuero 100%'),
(3, 4, 6, 'Sandalias Casuales', 'Sandalias cómodas para uso diario', '$65000', '$55000', 0.4, 'EVA, Textil'),

-- Accesorios
(4, 3, 5, 'Bolso de Cuero', 'Bolso de mano en cuero natural', '$150000', null, 0.6, 'Cuero 100%'),
(4, 3, 5, 'Cinturón Clásico', 'Cinturón en cuero con hebilla metálica', '$45000', '$38000', 0.2, 'Cuero 100%'),

-- Ropa Deportiva
(5, 8, 6, 'Camiseta Deportiva', 'Camiseta técnica para entrenamiento', '$55000', null, 0.2, 'Poliéster 100%'),
(5, 9, 6, 'Pantaloneta Deportiva', 'Short para running con tecnología Dri-FIT', '$65000', '$58000', 0.2, 'Poliéster 100%');

-- ====================================
-- VARIANTES DE PRODUCTO
-- ====================================
INSERT INTO VARIANTE_PRODUCTO (ID_PRODUCTO, ID_TALLA, ID_COLOR, SKU, PRECIO_VARIANTE, VARIANTE_ACTIVA) VALUES
-- Camisa Formal Blanca
(1, 2, 2, 'CAM-FORM-BL-S', '$89000', true),
(1, 3, 2, 'CAM-FORM-BL-M', '$89000', true),
(1, 4, 2, 'CAM-FORM-BL-L', '$89000', true),
(1, 5, 2, 'CAM-FORM-BL-XL', '$89000', true),

-- Pantalón de Vestir Negro
(2, 2, 1, 'PANT-VEST-NE-S', '$120000', true),
(2, 3, 1, 'PANT-VEST-NE-M', '$120000', true),
(2, 4, 1, 'PANT-VEST-NE-L', '$120000', true),
(2, 5, 1, 'PANT-VEST-NE-XL', '$120000', true),

-- Chaqueta Casual
(3, 3, 3, 'CHAQ-CAS-AZ-M', '$150000', true),
(3, 4, 3, 'CHAQ-CAS-AZ-L', '$150000', true),
(3, 4, 8, 'CHAQ-CAS-GR-L', '$150000', true),

-- Blusa Elegante
(4, 1, 7, 'BLUS-ELE-RO-XS', '$95000', true),
(4, 2, 7, 'BLUS-ELE-RO-S', '$95000', true),
(4, 3, 2, 'BLUS-ELE-BL-M', '$95000', true),

-- Vestido Casual
(5, 2, 4, 'VEST-CAS-RO-S', '$110000', true),
(5, 3, 4, 'VEST-CAS-RO-M', '$110000', true),
(5, 4, 1, 'VEST-CAS-NE-L', '$110000', true),

-- Tenis Deportivos
(7, 7, 1, 'TEN-DEP-NE-35', '$180000', true),
(7, 8, 1, 'TEN-DEP-NE-36', '$180000', true),
(7, 9, 2, 'TEN-DEP-BL-37', '$180000', true),
(7, 10, 2, 'TEN-DEP-BL-38', '$180000', true),
(7, 11, 1, 'TEN-DEP-NE-39', '$180000', true),
(7, 12, 1, 'TEN-DEP-NE-40', '$180000', true),

-- Zapatos de Cuero
(8, 11, 9, 'ZAP-CUE-MA-39', '$220000', true),
(8, 12, 9, 'ZAP-CUE-MA-40', '$220000', true),
(8, 13, 1, 'ZAP-CUE-NE-41', '$220000', true),
(8, 14, 1, 'ZAP-CUE-NE-42', '$220000', true);

-- ====================================
-- INVENTARIO
-- ====================================
INSERT INTO INVENTARIO (ID_VARIANTE, CANTIDAD_STOCK, STOCK_MINIMO, STOCK_MAXIMO, FECHA_ULTIMA_ACTUALIZACION) VALUES
(1, 25, 5, 50, CURRENT_DATE),
(2, 30, 5, 50, CURRENT_DATE),
(3, 20, 5, 50, CURRENT_DATE),
(4, 15, 5, 50, CURRENT_DATE),
(5, 18, 5, 40, CURRENT_DATE),
(6, 22, 5, 40, CURRENT_DATE),
(7, 12, 5, 40, CURRENT_DATE),
(8, 8, 5, 40, CURRENT_DATE),
(9, 35, 10, 60, CURRENT_DATE),
(10, 28, 10, 60, CURRENT_DATE),
(11, 15, 5, 30, CURRENT_DATE),
(12, 20, 5, 30, CURRENT_DATE),
(13, 25, 5, 30, CURRENT_DATE),
(14, 18, 5, 40, CURRENT_DATE),
(15, 22, 5, 40, CURRENT_DATE),
(16, 12, 5, 40, CURRENT_DATE),
(17, 45, 10, 80, CURRENT_DATE),
(18, 38, 10, 80, CURRENT_DATE),
(19, 42, 10, 80, CURRENT_DATE),
(20, 35, 10, 80, CURRENT_DATE),
(21, 28, 10, 80, CURRENT_DATE),
(22, 32, 10, 80, CURRENT_DATE),
(23, 15, 5, 30, CURRENT_DATE),
(24, 18, 5, 30, CURRENT_DATE),
(25, 12, 5, 30, CURRENT_DATE),
(26, 20, 5, 30, CURRENT_DATE);

-- ====================================
-- ÓRDENES
-- ====================================
INSERT INTO ORDEN (FECHA_ORDEN, DIRECCION_ENVIO, FECHA_ENTREGA_REAL, ESTADO_PEDIDO, TOTAL_ORDEN, FECHA_ENTREGA_ESTIMADA, METODO_PAGO, ID_PERSONA) VALUES
('2024-01-15', 'Calle 116 #9-45, Apto 801, Bogotá', '2024-01-18', 'Entregado', '$264000', '2024-01-17', 'Tarjeta de Crédito', 7),
('2024-01-20', 'Carrera 15 #85-67, Casa 15, Bogotá', '2024-01-23', 'Entregado', '$180000', '2024-01-22', 'PSE', 8),
('2024-02-05', 'Calle 72 #11-89, Apto 402, Bogotá', '2024-02-08', 'Entregado', '$95000', '2024-02-07', 'Efectivo', 9),
('2024-02-12', 'Carrera 9 #116-34, Casa 22, Bogotá', '2024-02-15', 'Entregado', '$220000', '2024-02-14', 'Tarjeta Débito', 10),
('2024-02-20', 'Calle 134 #7-56, Apto 603, Bogotá', '2024-02-23', 'Entregado', '$110000', '2024-02-22', 'Tarjeta de Crédito', 11),
('2024-03-01', 'Carrera 19 #93-12, Casa 9, Bogotá', '2024-03-04', 'Entregado', '$89000', '2024-03-03', 'PSE', 12),
('2024-03-10', 'Calle 100 #15-78, Apto 505, Bogotá', CURRENT_DATE + 2, 'En Tránsito', '$340000', CURRENT_DATE + 1, 'Tarjeta de Crédito', 13),
('2024-03-15', 'Carrera 11 #127-45, Casa 18, Bogotá', CURRENT_DATE + 3, 'Procesando', '$75000', CURRENT_DATE + 2, 'Efectivo', 14);

-- ====================================
-- ORDEN_PRODUCTO (Detalles de las órdenes)
-- ====================================
INSERT INTO ORDEN_PRODUCTO (ID_VARIANTE, ID_ORDEN, ID_PERSONA, CANTIDAD, PRECIO_UNITARIO, SUBTOTAL, DESCUENTO_APLICADO) VALUES
-- Orden 1 (Sofía Hernández)
(1, 1, 7, 2, '$89000', '$178000', '$14000'),
(2, 1, 7, 1, '$120000', '$120000', null),

-- Orden 2 (Alejandro Ruiz)
(17, 2, 8, 1, '$180000', '$180000', '$20000'),

-- Orden 3 (Valentina Torres)
(12, 3, 9, 1, '$95000', '$95000', null),

-- Orden 4 (Sebastián Morales)
(25, 4, 10, 1, '$220000', '$220000', null),

-- Orden 5 (Isabella Ramírez)
(14, 5, 11, 1, '$110000', '$110000', null),

-- Orden 6 (Mateo Silva)
(1, 6, 12, 1, '$89000', '$89000', null),

-- Orden 7 (Camila Pineda)
(17, 7, 13, 1, '$180000', '$180000', null),
(5, 7, 13, 1, '$120000', '$120000', null),
(12, 7, 13, 1, '$95000', '$95000', '$15000'),

-- Orden 8 (Daniel Ospina)
(6, 8, 14, 1, '$75000', '$75000', null);

-- ====================================
-- CÓDIGOS DE AUTENTICACIÓN (Ejemplos)
-- ====================================
INSERT INTO AUTH_CODES (EMAIL, CODE, EXPIRES_AT, USED) VALUES
('carlos.rodriguez@empresa.com.co', '123456', NOW() + INTERVAL '15 minutes', false),
('maria.lopez@empresa.com.co', '789012', NOW() + INTERVAL '10 minutes', false),
('sofia.hernandez@gmail.com', '345678', NOW() - INTERVAL '5 minutes', true),
('alejandro.ruiz@hotmail.com', '901234', NOW() + INTERVAL '12 minutes', false);

-- ====================================
-- VERIFICACIÓN DE DATOS
-- ====================================
-- Mostrar resumen de datos insertados
SELECT 'CATEGORÍAS' as TABLA, COUNT(*) as REGISTROS FROM CATEGORIA
UNION ALL
SELECT 'COLORES', COUNT(*) FROM COLOR
UNION ALL
SELECT 'TALLAS', COUNT(*) FROM TALLA
UNION ALL
SELECT 'MARCAS', COUNT(*) FROM MARCA
UNION ALL
SELECT 'PROVEEDORES', COUNT(*) FROM PROVEEDOR
UNION ALL
SELECT 'PERSONAS', COUNT(*) FROM PERSONA
UNION ALL
SELECT 'EMPLEADOS', COUNT(*) FROM EMPLEADO
UNION ALL
SELECT 'CLIENTES', COUNT(*) FROM CLIENTE
UNION ALL
SELECT 'PRODUCTOS', COUNT(*) FROM PRODUCTO
UNION ALL
SELECT 'VARIANTES', COUNT(*) FROM VARIANTE_PRODUCTO
UNION ALL
SELECT 'INVENTARIO', COUNT(*) FROM INVENTARIO
UNION ALL
SELECT 'ÓRDENES', COUNT(*) FROM ORDEN
UNION ALL
SELECT 'DETALLES ORDEN', COUNT(*) FROM ORDEN_PRODUCTO
UNION ALL
SELECT 'CÓDIGOS AUTH', COUNT(*) FROM AUTH_CODES;
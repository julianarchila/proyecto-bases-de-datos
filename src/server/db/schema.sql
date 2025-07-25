/*==============================================================*/
/* Table: CATEGORIA                                             */
/*==============================================================*/
create table CATEGORIA (
   ID_CATEGORIA         SERIAL               not null,
   NOMBRE_CATEGORIA     VARCHAR(50)          not null,
   CATEGORIA_ACTIVA     BOOL                 not null,
   DESCRIPCION_CATEGORIA VARCHAR(255)         null,
   constraint PK_CATEGORIA primary key (ID_CATEGORIA)
);

/*==============================================================*/
/* Index: CATEGORIA_PK                                          */
/*==============================================================*/
create unique index CATEGORIA_PK on CATEGORIA (
ID_CATEGORIA
);

/*==============================================================*/
/* Table: CLIENTE                                               */
/*==============================================================*/
create table CLIENTE (
   ID_CLIENTE           INT4                 not null,
   FECHA_REGISTRO       DATE                 not null,
   PREFERENCIAS_NEWSLETTER BOOL                 not null,
   constraint PK_CLIENTE primary key (ID_CLIENTE)
);

/*==============================================================*/
/* Index: CLIENTE_PK                                            */
/*==============================================================*/
create unique index CLIENTE_PK on CLIENTE (
ID_CLIENTE
);

/*==============================================================*/
/* Table: COLOR                                                 */
/*==============================================================*/
create table COLOR (
   ID_COLOR             SERIAL               not null,
   NOMBRE_COLOR         VARCHAR(50)          not null,
   CODIGO_HEX           VARCHAR(7)           not null,
   DESCRIPCION_COLOR    VARCHAR(255)         null,
   constraint PK_COLOR primary key (ID_COLOR)
);

/*==============================================================*/
/* Index: COLOR_PK                                              */
/*==============================================================*/
create unique index COLOR_PK on COLOR (
ID_COLOR
);

/*==============================================================*/
/* Table: EMPLEADO                                              */
/*==============================================================*/
create table EMPLEADO (
   ID_EMPLEADO          INT4                 not null,
   CARGO                VARCHAR(50)          not null,
   SALARIO              MONEY                not null,
   FECHA_CONTRATACION   DATE                 not null,
   ESTADO_ACTIVO        BOOL                 not null,
   constraint PK_EMPLEADO primary key (ID_EMPLEADO)
);

/*==============================================================*/
/* Index: EMPLEADO_PK                                           */
/*==============================================================*/
create unique index EMPLEADO_PK on EMPLEADO (
ID_EMPLEADO
);

/*==============================================================*/
/* Table: INVENTARIO                                            */
/*==============================================================*/
create table INVENTARIO (
   ID_INVENTARIO        SERIAL               not null,
   ID_VARIANTE          INT4                 not null,
   CANTIDAD_STOCK       INT4                 not null,
   STOCK_MINIMO         INT4                 not null,
   STOCK_MAXIMO         INT4                 not null,
   FECHA_ULTIMA_ACTUALIZACION DATE                 not null,
   constraint PK_INVENTARIO primary key (ID_INVENTARIO)
);

/*==============================================================*/
/* Index: INVENTARIO_PK                                         */
/*==============================================================*/
create unique index INVENTARIO_PK on INVENTARIO (
ID_INVENTARIO
);

/*==============================================================*/
/* Index: REGISTRA_INVENTARIO_FK                                */
/*==============================================================*/
create  index REGISTRA_INVENTARIO_FK on INVENTARIO (
ID_VARIANTE
);

/*==============================================================*/
/* Table: MARCA                                                 */
/*==============================================================*/
create table MARCA (
   ID_MARCA             SERIAL               not null,
   NOMBRE_MARCA         VARCHAR(50)          not null,
   DESCRIPCION_MARCA    VARCHAR(255)         null,
   PAIS_ORIGEN          VARCHAR(50)          null,
   WEBSITE              VARCHAR(100)         null,
   constraint PK_MARCA primary key (ID_MARCA)
);

/*==============================================================*/
/* Index: MARCA_PK                                              */
/*==============================================================*/
create unique index MARCA_PK on MARCA (
ID_MARCA
);

/*==============================================================*/
/* Table: ORDEN                                                 */
/*==============================================================*/
create table ORDEN (
   ID_ORDEN             SERIAL               not null,
   FECHA_ORDEN          DATE                 not null,
   DIRECCION_ENVIO      VARCHAR(255)         not null,
   FECHA_ENTREGA_REAL   DATE                 not null,
   ESTADO_PEDIDO        VARCHAR(30)          not null,
   TOTAL_ORDEN          MONEY                not null,
   FECHA_ENTREGA_ESTIMADA DATE                 null,
   METODO_PAGO          VARCHAR(30)          null,
   ID_PERSONA           INT4                 not null,
   constraint PK_ORDEN primary key (ID_ORDEN)
);

/*==============================================================*/
/* Index: ORDEN_PK                                              */
/*==============================================================*/
create unique index ORDEN_PK on ORDEN (
ID_ORDEN
);

/*==============================================================*/
/* Index: REALIZA_ORDEN_FK                                      */
/*==============================================================*/
create unique index REALIZA_ORDEN_FK on ORDEN (
ID_PERSONA
);

/*==============================================================*/
/* Table: ORDEN_PRODUCTO                                        */
/*==============================================================*/
create table ORDEN_PRODUCTO (
   ID_VARIANTE          INT4                 not null,
   ID_ORDEN             INT4                 not null,
   ID_PERSONA           INT4                 not null,
   CANTIDAD             INT4                 not null,
   PRECIO_UNITARIO      MONEY                not null,
   SUBTOTAL             MONEY                not null,
   DESCUENTO_APLICADO   MONEY                null,
   constraint PK_ORDEN_PRODUCTO primary key (ID_VARIANTE, ID_ORDEN, ID_PERSONA)
);

/*==============================================================*/
/* Index: ORDEN_PRODUCTO_PK                                     */
/*==============================================================*/
create unique index ORDEN_PRODUCTO_PK on ORDEN_PRODUCTO (
ID_VARIANTE,
ID_ORDEN,
ID_PERSONA
);

/*==============================================================*/
/* Index: ORDEN_PRODUCTO2_FK                                    */
/*==============================================================*/
create  index ORDEN_PRODUCTO2_FK on ORDEN_PRODUCTO (
ID_ORDEN
);

/*==============================================================*/
/* Index: ORDEN_PRODUCTO_FK                                     */
/*==============================================================*/
create  index ORDEN_PRODUCTO_FK on ORDEN_PRODUCTO (
ID_VARIANTE
);

/*==============================================================*/
/* Table: PERSONA                                               */
/*==============================================================*/
create table PERSONA (
   ID_PERSONA           SERIAL               not null,
   NOMBRE               VARCHAR(50)          not null,
   APELLIDO             VARCHAR(50)          not null,
   EMAIL                VARCHAR(100)         not null,
   TELEFONO             VARCHAR(20)          not null,
   DIRECCION            VARCHAR(255)         null,
   FECHA_NACIMIENTO     DATE                 null,
   constraint PK_PERSONA primary key (ID_PERSONA)
);

/*==============================================================*/
/* Index: PERSONA_PK                                            */
/*==============================================================*/
create unique index PERSONA_PK on PERSONA (
ID_PERSONA
);

/*==============================================================*/
/* Table: PRODUCTO                                              */
/*==============================================================*/
create table PRODUCTO (
   ID_PRODUCTO          SERIAL               not null,
   ID_CATEGORIA         INT4                 null,
   ID_MARCA             INT4                 not null,
   ID_PROVEEDOR         INT4                 not null,
   NOMBRE_PRODUCTO      VARCHAR(100)         not null,
   DESCRIPCION          VARCHAR(255)         not null,
   PRECIO               MONEY                not null,
   PRECIO_OFERTA        MONEY                null,
   PESO                 DECIMAL              null,
   MATERIAL             VARCHAR(100)         null,
   constraint PK_PRODUCTO primary key (ID_PRODUCTO)
);

/*==============================================================*/
/* Index: PRODUCTO_PK                                           */
/*==============================================================*/
create unique index PRODUCTO_PK on PRODUCTO (
ID_PRODUCTO
);

/*==============================================================*/
/* Index: PERTENECE_CATEGORIA_FK                                */
/*==============================================================*/
create  index PERTENECE_CATEGORIA_FK on PRODUCTO (
ID_CATEGORIA
);

/*==============================================================*/
/* Index: PERTENECE_MARCA_FK                                    */
/*==============================================================*/
create  index PERTENECE_MARCA_FK on PRODUCTO (
ID_MARCA
);

/*==============================================================*/
/* Index: OFRECIDO_POR_PROVEEDOR_FK                             */
/*==============================================================*/
create  index OFRECIDO_POR_PROVEEDOR_FK on PRODUCTO (
ID_PROVEEDOR
);

/*==============================================================*/
/* Table: PROVEEDOR                                             */
/*==============================================================*/
create table PROVEEDOR (
   ID_PROVEEDOR         SERIAL               not null,
   NOMBRE_EMPRESA       VARCHAR(100)         not null,
   EMAIL_PROVEEDOR      VARCHAR(100)         not null,
   TELEFONO_PROVEEDOR   VARCHAR(20)          not null,
   DIRECCION_PROVEEDOR  VARCHAR(255)         not null,
   CIUDAD               VARCHAR(50)          not null,
   PAIS                 VARCHAR(50)          not null,
   constraint PK_PROVEEDOR primary key (ID_PROVEEDOR)
);

/*==============================================================*/
/* Index: PROVEEDOR_PK                                          */
/*==============================================================*/
create unique index PROVEEDOR_PK on PROVEEDOR (
ID_PROVEEDOR
);

/*==============================================================*/
/* Table: TALLA                                                 */
/*==============================================================*/
create table TALLA (
   ID_TALLA             SERIAL               not null,
   CODIGO_TALLA         VARCHAR(10)          not null,
   DESCRIPCION_TALLA    VARCHAR(50)          not null,
   EQUIVALENCIA_NUMERICA INT4                 not null,
   constraint PK_TALLA primary key (ID_TALLA)
);

/*==============================================================*/
/* Index: TALLA_PK                                              */
/*==============================================================*/
create unique index TALLA_PK on TALLA (
ID_TALLA
);

/*==============================================================*/
/* Table: VARIANTE_PRODUCTO                                     */
/*==============================================================*/
create table VARIANTE_PRODUCTO (
   ID_VARIANTE          SERIAL               not null,
   ID_PRODUCTO          INT4                 not null,
   ID_TALLA             INT4                 not null,
   ID_COLOR             INT4                 not null,
   SKU                  VARCHAR(30)          null,
   PRECIO_VARIANTE      MONEY                null,
   VARIANTE_ACTIVA      BOOL                 null,
   constraint PK_VARIANTE_PRODUCTO primary key (ID_VARIANTE)
);

/*==============================================================*/
/* Index: VARIANTE_PRODUCTO_PK                                  */
/*==============================================================*/
create unique index VARIANTE_PRODUCTO_PK on VARIANTE_PRODUCTO (
ID_VARIANTE
);

/*==============================================================*/
/* Index: TIENE_VARIANTE_FK                                     */
/*==============================================================*/
create  index TIENE_VARIANTE_FK on VARIANTE_PRODUCTO (
ID_PRODUCTO
);

/*==============================================================*/
/* Index: USA_TALLA_FK                                          */
/*==============================================================*/
create  index USA_TALLA_FK on VARIANTE_PRODUCTO (
ID_TALLA
);

/*==============================================================*/
/* Index: USA_COLOR_FK                                          */
/*==============================================================*/
create  index USA_COLOR_FK on VARIANTE_PRODUCTO (
ID_COLOR
);

alter table CLIENTE
   add constraint FK_CLIENTE_CLIENTE_P_PERSONA foreign key (ID_CLIENTE)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table EMPLEADO
   add constraint FK_EMPLEADO_PERSONA foreign key (ID_EMPLEADO)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table INVENTARIO
   add constraint FK_INVENTAR_REGISTRA__VARIANTE foreign key (ID_VARIANTE)
      references VARIANTE_PRODUCTO (ID_VARIANTE)
      on delete restrict on update restrict;

alter table ORDEN
   add constraint FK_ORDEN_REALIZA_O_PERSONA foreign key (ID_PERSONA)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table ORDEN_PRODUCTO
   add constraint FK_ORDEN_PR_ORDEN_PRO_VARIANTE foreign key (ID_VARIANTE)
      references VARIANTE_PRODUCTO (ID_VARIANTE)
      on delete restrict on update restrict;

alter table ORDEN_PRODUCTO
   add constraint FK_ORDEN_PR_ORDEN_PRO_ORDEN foreign key (ID_ORDEN)
      references ORDEN (ID_ORDEN)
      on delete restrict on update restrict;

alter table ORDEN_PRODUCTO
   add constraint FK_ORDEN_PR_PERSONA foreign key (ID_PERSONA)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table PRODUCTO
   add constraint FK_PRODUCTO_OFRECIDO__PROVEEDO foreign key (ID_PROVEEDOR)
      references PROVEEDOR (ID_PROVEEDOR)
      on delete restrict on update restrict;

alter table PRODUCTO
   add constraint FK_PRODUCTO_PERTENECE_CATEGORI foreign key (ID_CATEGORIA)
      references CATEGORIA (ID_CATEGORIA)
      on delete restrict on update restrict;

alter table PRODUCTO
   add constraint FK_PRODUCTO_PERTENECE_MARCA foreign key (ID_MARCA)
      references MARCA (ID_MARCA)
      on delete restrict on update restrict;

alter table VARIANTE_PRODUCTO
   add constraint FK_VARIANTE_TIENE_VAR_PRODUCTO foreign key (ID_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table VARIANTE_PRODUCTO
   add constraint FK_VARIANTE_USA_COLOR_COLOR foreign key (ID_COLOR)
      references COLOR (ID_COLOR)
      on delete restrict on update restrict;

alter table VARIANTE_PRODUCTO
   add constraint FK_VARIANTE_USA_TALLA_TALLA foreign key (ID_TALLA)
      references TALLA (ID_TALLA)
      on delete restrict on update restrict;



/*==============================================================*/
/* Table: AUTH_CODES                                            */
/*==============================================================*/
create table AUTH_CODES (
   ID_AUTH_CODE         SERIAL               not null,
   EMAIL                VARCHAR(100)         not null,
   CODE                 VARCHAR(6)           not null,
   EXPIRES_AT           TIMESTAMP            not null,
   USED                 BOOL                 not null default false,
   CREATED_AT           TIMESTAMP            not null default NOW(),
   constraint PK_AUTH_CODES primary key (ID_AUTH_CODE)
);

/*==============================================================*/
/* Index: AUTH_CODES_PK                                         */
/*==============================================================*/
create unique index AUTH_CODES_PK on AUTH_CODES (
ID_AUTH_CODE
);

/*==============================================================*/
/* Index: IDX_AUTH_CODES_EMAIL_CODE                             */
/*==============================================================*/
create index IDX_AUTH_CODES_EMAIL_CODE on AUTH_CODES (
EMAIL,
CODE
);

/*==============================================================*/
/* Index: IDX_AUTH_CODES_EXPIRES                                */
/*==============================================================*/
create index IDX_AUTH_CODES_EXPIRES on AUTH_CODES (
EXPIRES_AT
);

/*==============================================================*/
/* Index: IDX_AUTH_CODES_EMAIL                                  */
/*==============================================================*/
create index IDX_AUTH_CODES_EMAIL on AUTH_CODES (
EMAIL
);
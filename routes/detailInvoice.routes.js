const { Router } = require("express");
const { check } = require("express-validator");
const {
    getDetailInvoice,
    getDetailInvoiceById,
    createDetailInvoice,
    updateDetailInvoice,
    deleteDetailInvoice,
} = require("../controllers/detailInvoice.controller");

// Importa validadores personalizados para verificar si un producto, una factura o un detalle de factura existe en la base de datos
const {
  productExistById,
  detailInvoiceExistById,
  invoiceExistById,
} = require("../helpers/db-validators");

// Importa middlewares personalizados para validar un token JWT y validar los campos de entrada
const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

// Ruta para obtener todos los detalles de factura
router.get("/", getDetailInvoice);

// Ruta para obtener un detalle de factura por su ID
router.get(
  "/:id",
  [
    // Comprueba si el parámetro ID es un ID válido de Mongo
    check("id", "no es un ID de Mongo válido").isMongoId(),
    // Comprueba si el detalle de factura con el ID proporcionado existe en la base de datos
    check("id").custom(detailInvoiceExistById),
    // Ejecuta la validación de campos
    validateFields,
  ],
  getDetailInvoiceById
);

// Ruta para crear un nuevo detalle de factura
router.post(
  "/",
  [
    // Comprueba si el campo "product" no está vacío
    check("product", "El producto es obligatorio").not().isEmpty(),
    // Comprueba si el campo "product" es un ID válido de Mongo
    check("product", "no es un ID de Mongo válido").isMongoId(),
    // Comprueba si el producto con el ID proporcionado existe en la base de datos
    check("product").custom(productExistById),
    // Comprueba si el campo "invoice" no está vacío
    check("invoice", "La factura es obligatoria").not().isEmpty(),
    // Comprueba si el campo "invoice" es un ID válido de Mongo
    check("invoice", "no es un ID de Mongo válido").isMongoId(),
    // Comprueba si la factura con el ID proporcionado existe en la base de datos
    check("invoice").custom(invoiceExistById),
    // Comprueba si el campo "productUnit" no está vacío y es un número entero entre 1 y 7
    check("productUnit", "La cantidad de productos es obligatoria y debe ser un número entero entre 1 y 7").isInt({ min: 1, max: 7 }).not().isEmpty(),
    // Ejecuta la validación de token JWT y la validación de campos
    validateJWT,
    validateFields,
  ],
  createDetailInvoice
);

// Ruta para actualizar un detalle de factura existente
    router.put(
        "/:id",
        [
         
    // Ejecuta la validación de token JWT y la validación de campos
    validateJWT,
    // Comprueba si el campo "status" no está vacío

          check("status", "El estado es obligatorio").not().isEmpty(),
          check("product", "El producto es obligatorio").not().isEmpty(),
          check("product", "El ID del producto debe ser un ID de Mongo válido").isMongoId(),
          check("product").custom(productExistById),
          check("invoice", "La factura es obligatoria").not().isEmpty(),
          check("invoice", "El ID de la factura debe ser un ID de Mongo válido").isMongoId(),
          check("productUnit", "La cantidad de productos es obligatoria y debe ser un número entero").isInt({min: 1}),
          validateFields,
        ],
        updateDetailInvoice 
      );
      
      router.delete(
        "/:id",
        [
          validateJWT,
          check("id", "is not a mongoID").isMongoId(),
          check("id").custom(detailInvoiceExistById),
          validateFields,
        ],
        deleteDetailInvoice
      );
      
      
      module.exports = router;
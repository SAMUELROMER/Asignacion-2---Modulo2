const { Router } = require("express");
const { check } = require("express-validator");

// Importamos los controladores para las diferentes rutas del endpoint
const {
  getInvoice,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoice.controller");

// Importamos las funciones de validación de la base de datos desde el helper db-validators
const {
  invoiceExistById,// Se debe tener la validacion en db-validator
  userByIdExist,
} = require("../helpers/db-validators");

// Importamos middlewares para validar el token JWT y los campos de las solicitudes
const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

// Definimos la ruta para obtener todas las facturas mediante GET
router.get("/", getInvoice);

// Definimos la ruta para obtener una factura mediante su id mediante GET
router.get(
  "/:id",
  [
    check("id", "No es un ID de MongoDB válido").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  getInvoiceById
);

// Definimos la ruta para crear una nueva factura mediante POST
router.post(
  "/",
  [
    check("user", "El campo user es obligatorio").not().isEmpty(),
    check("user", "No es un ID de MongoDB válido").isMongoId(),
    check("user").custom(userByIdExist),
    validateJWT,
    validateFields,
  ],
  createInvoice
);

// Definimos la ruta para actualizar una factura mediante PUT
router.put(
  [
    validateJWT,
    check("name", "El campo name es obligatorio").not().isEmpty(),
    check("id", "No es un ID de MongoDB válido").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  updateInvoice
);

// Definimos la ruta para eliminar una factura mediante DELETE
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un ID de MongoDB válido").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  deleteInvoice
);

module.exports = router;
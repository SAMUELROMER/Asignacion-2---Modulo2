const { Router } = require("express");
const { check } = require("express-validator");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  productExistById,
  categoryExistById,
} = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(productExistById),
    validateFields,
  ],
  getProductById
);

router.post(
  "/",
  [
    check("category", "category is mandatory").not().isEmpty(),
    check("category", "is not a mongoID").isMongoId(),
    check("category").custom(categoryExistById),
    check("name", "name is mandatory").not().isEmpty(),
    validateJWT,
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("name", "name is mandatory").not().isEmpty(),
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(productExistById),
    validateFields,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(productExistById),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;

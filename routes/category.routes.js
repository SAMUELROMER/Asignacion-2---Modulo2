const { Router } = require("express");
const { check } = require("express-validator");
const {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { categoryExistById } = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(categoryExistById),
    validateFields,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    check("name", "name is mandatory").not().isEmpty(),
    validateJWT,
    validateFields,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("name", "name is mandatory").not().isEmpty(),
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(categoryExistById),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(categoryExistById),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;

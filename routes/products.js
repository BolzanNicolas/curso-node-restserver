const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct } = require("../controllers/products");
const { productExists, categoryExists } = require("../helpers/db-validators");

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(productExists),
  validateFields
], getProduct);

router.post('/', [
  validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  check('category', 'Invalid Category ID').isMongoId(),
  check('category').custom(categoryExists),
  validateFields
], createProduct);

router.put('/:id', [
  validateJWT,
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(productExists),
  validateFields
], updateProduct);

router.delete("/:id", [
  validateJWT,
  isAdminRole,
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(productExists),
  validateFields
], deleteProduct);

module.exports = router;
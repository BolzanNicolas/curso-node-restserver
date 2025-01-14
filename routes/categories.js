const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require("../controllers/categories");
const { categoryExists } = require("../helpers/db-validators");

const router = Router();

// Get all categories - public
router.get('/', getCategories);

// Get category with id - public
router.get('/:id', [
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(categoryExists),
  validateFields
], getCategory);

// Get category - private - any user with a valid token
router.post('/', [
  validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  validateFields
], createCategory);

// Update - private - any user with a valid token
router.put('/:id', [
  validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(categoryExists),
  validateFields
], updateCategory);

// Delete category - Admin
router.delete("/:id", [
  validateJWT,
  isAdminRole,
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(categoryExists),
  validateFields
], deleteCategory);

module.exports = router;
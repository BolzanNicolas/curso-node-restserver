const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUsers,
  putUser,
  postUser,
  deleteUser,
} = require("../controllers/users");

const { validateFields } = require("../middlewares/validate-fields");
const { isValidRole, emailExists, userExists } = require("../helpers/db-validators");

const router = Router();

router.get("/", getUsers);

router.put("/:id", [
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(userExists),
  check('role').custom(isValidRole),
  validateFields
], putUser);

router.post("/", [
  check("email", "Invalid email").isEmail(),
  check("name", "Name is required").not().isEmpty(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  check('email').custom(emailExists),
  check('role').custom(isValidRole),
  validateFields
], postUser);

router.delete("/:id", [
  check('id', 'Invalid ID').isMongoId(),
  check('id').custom(userExists),
  validateFields
], deleteUser);

module.exports = router;

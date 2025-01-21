const { Router } = require("express");
const { check } = require("express-validator");

const { validateFileUpload, validateFields } = require("../middlewares");
const { upload, updateImageCloudinary, showImage } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { Collection } = require("mongoose");

const router = Router();

router.post('/', [
  validateFileUpload
], upload);

router.put('/:collection/:id', [
  validateFileUpload,
  check('id', 'Invalid ID').isMongoId(),
  check('collection').custom(c => allowedCollections(c, ['users','products'])),
  validateFields
], updateImageCloudinary);

router.get('/:collection/:id', [
  check('id', 'Invalid ID').isMongoId(),
  check('collection').custom(c => allowedCollections(c, ['users','products'])),
  validateFields
], showImage);

module.exports = router;
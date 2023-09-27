const express = require('express');

const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;

const express = require('express');

const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} = require('../controllers/productController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getProducts).post(protect, restrictTo, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, restrictTo, updateProduct)
  .delete(protect, restrictTo, deleteProduct);

module.exports = router;

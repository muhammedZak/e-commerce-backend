const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  addOrderItems,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require('../controllers/orderController');

const router = express.Router();

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, restrictTo, getOrders);

router.route('/my-orders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, restrictTo, updateOrderToDelivered);

module.exports = router;

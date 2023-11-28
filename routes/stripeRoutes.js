const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { protect, restrictTo } = require('../controllers/authController');
const catchAsync = require('../utils/catchAsync');
const { calcPrices } = require('../utils/calcPrices');
const AppError = require('../utils/appError');

const router = express.Router();

router.post(
  '/create-checkout-session',
  protect,
  catchAsync(async (req, res, next) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      next(new AppError('No order items'));
    } else {
      const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
      });

      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
        );

        return {
          ...itemFromClient,
          product: itemFromClient._id,
          price: matchingItemFromDB.price,
          _id: undefined,
        };
      });

      // calculate price
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrices(dbOrderItems);

      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      // console.log(createdOrder);

      const line_items = orderItems.map((item) => {
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.name,
              metadata: {
                id: item._id,
              },
            },
            unit_amount: item.price * 100,
          },
          quantity: item.qty,
        };
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.BACKEND_URL}/api/payments/success?orderId=${createdOrder._id}`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
      });

      res.send({ url: session.url });
    }
  })
);

router.get(
  '/success',
  catchAsync(async (req, res, next) => {
    const { orderId } = req.query;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.redirect(`${process.env.CLIENT_URL}/orders/${order._id}`);
  })
);

module.exports = router;

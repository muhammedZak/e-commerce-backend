const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { calcPrices } = require('../utils/calcPrices');

// creating order

exports.addOrderItems = catchAsync(async (req, res, next) => {
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
    res.status(201).json(createdOrder);
  }
});

// get user order

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  res.status(200).json(order);
});

// get order by id by admin

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json(order);
});

// updating order to paid by user

exports.updateOrderToPaid = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    return next(new AppError('Order not found', 404));
  }
});

// updating order to delivered by admin

exports.updateOrderToDelivered = catchAsync(async (req, res, next) => {
  res.send('update order to delivered');
});

// get all orders by admin

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

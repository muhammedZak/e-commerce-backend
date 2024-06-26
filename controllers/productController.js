const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getProducts = catchAsync(async (req, res, next) => {
  const { pageNumber, keyword, filter, attr, minPrice, maxPrice } = req.query;

  const pageSize = 8;
  const page = Number(pageNumber) || 1;

  const search = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
  const category = filter ? { category: filter } : {};

  const material = attr ? JSON.parse(decodeURIComponent(attr)) : [];

  const attributes = material.length
    ? { 'productDetails.value': material.map((item) => item.value) }
    : {};

  const priceRange = {};
  if (minPrice && maxPrice) {
    priceRange.price = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice) {
    priceRange.price = { $gte: minPrice };
  } else if (maxPrice) {
    priceRange.price = { $lte: maxPrice };
  }

  const count = await Product.countDocuments({
    ...search,
    ...category,
    ...attributes,
    ...priceRange,
  });

  const products = await Product.find({
    ...search,
    ...category,
    ...attributes,
    ...priceRange,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({
    results: products.length,
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    next(new AppError('item not found', 404));
  }
  res.status(200).json(product);
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    message: 'Created successfully',
    product: newProduct,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json(product);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    message: 'Product removed',
  });
});

exports.createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return next(new AppError('Product already reviewed', 400));
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    return next(new AppError('Product not found', 404));
  }
});

exports.getTopProducts = catchAsync(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(9);

  res.json(products);
});

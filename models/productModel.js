const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  countInStock: Number,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  productDetails: [
    {
      title: String,
      value: String,
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

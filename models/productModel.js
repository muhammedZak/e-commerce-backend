const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

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
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  countInStock: Number,
  images: [
    {
      url: String,
      path: String,
    },
  ],
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

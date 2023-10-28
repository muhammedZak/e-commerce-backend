const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  contact: {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
  },
  addressDetails: {
    pin: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  defaultAddress: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;

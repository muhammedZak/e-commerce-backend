const Address = require('../models/addressModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.addAddress = catchAsync(async (req, res, next) => {
  if (req.body.defaultAddress === true) {
    await Address.updateMany({ user: req.user.id }, { defaultAddress: false });
  }

  const newAddress = await Address.create({
    user: req.user.id,
    contact: {
      name: req.body.name,
      mobile: req.body.mobile,
    },
    addressDetails: {
      pin: req.body.pin,
      address: req.body.address,
      town: req.body.town,
      district: req.body.district,
      state: req.body.state,
      country: req.body.country,
    },
    defaultAddress: req.body.defaultAddress,
  });

  res.status(201).json({
    address: newAddress,
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const address = await Address.find({ user: req.user.id });

  if (!address) {
    return next(new AppError('Address Not find', 404));
  }

  res.status(200).json({
    address,
    results: address.length,
  });
});

exports.getAddressById = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Address Not find', 404));
  }

  res.status(200).json({
    address,
    results: 'Success',
  });
});

exports.editAddress = catchAsync(async (req, res, next) => {
  if (req.body.defaultAddress === true) {
    await Address.updateMany(
      { user: req.user.id, defaultAddress: true },
      { defaultAddress: false }
    );
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    {
      contact: {
        name: req.body.name,
        mobile: req.body.mobile,
      },
      addressDetails: {
        pin: req.body.pin,
        address: req.body.address,
        town: req.body.town,
        district: req.body.district,
        state: req.body.state,
        country: req.body.country,
      },
      defaultAddress: req.body.defaultAddress,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    address: updatedAddress,
    result: 'Success',
  });
});

exports.setDefault = catchAsync(async (req, res, next) => {
  await Address.updateMany(
    { user: req.user.id, defaultAddress: true },
    { defaultAddress: false }
  );

  await Address.findByIdAndUpdate(req.params.id, { defaultAddress: true });

  res.status(200).json({
    message: 'Success',
  });
});

exports.removeAddress = catchAsync(async (req, res, next) => {
  // const isDefaultAddress = await Address.f

  const address = await Address.findByIdAndDelete(req.params.id);

  if (!address) {
    return next(new AppError('No address found with that ID', 404));
  }

  if (address.defaultAddress === true) {
    await Address.findOneAndUpdate(
      { user: req.user.id },
      { defaultAddress: true }
    );
  }

  res.status(204).json({
    message: 'Successufully deleted',
  });
});

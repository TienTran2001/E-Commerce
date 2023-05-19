const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');
const { response } = require('express');

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select('cart')
    .populate('cart.product', 'title price');

  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => sum + el.product.price * el.quantity,
    0
  );
  const createData = { products, total, coupon, orderBy: _id };
  createData.total = total;
  if (coupon) {
    const selectCoupon = await Coupon.findById(coupon);
    total = Math.round(total * (1 - +selectCoupon?.discount / 100)) || total;
    createData.total = total;
    createData.coupon = coupon;
    console.log(total);
  }
  const response = await Order.create(createData);

  return res.status(200).json({
    success: response ? true : false,
    newOrder: response || 'Something went wrong',
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const response = await Order.find();

  return res.status(200).json({
    success: response ? true : false,
    Orders: response,
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });

  return res.status(200).json({
    success: response ? true : false,
    Orders: response,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error('Missing status');
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    updateStatus: response || 'Something went wrong',
  });
});

module.exports = {
  createOrder,
  getOrders,
  getUserOrder,
  updateStatus,
};

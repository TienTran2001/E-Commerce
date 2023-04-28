const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error('Missing inputs');
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response,
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select('-createAt -updateAt');
  return res.status(200).json({
    success: response ? true : false,
    coupons: response,
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updateCoupon: response ? response : 'Cannot update coupon',
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.status(200).json({
    success: response ? true : false,
    response: response
      ? `Deleted coupon ${response.name}`
      : 'Cannot delete coupon ',
  });
});

module.exports = {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};

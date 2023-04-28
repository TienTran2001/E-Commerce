const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');
const brand = require('../models/brand');

const createBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBrand: response ? response : 'Cannot created brand',
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find().select('title _id');
  return res.status(200).json({
    success: response ? true : false,
    brands: response ? response : 'Brand not found!',
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;

  const response = await Brand.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updateBrand: response ? response : 'Cannot update brand',
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndDelete(bid);
  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `Deleted blog brand ${response.title}`
      : 'Cannot delete brand',
  });
});

module.exports = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};

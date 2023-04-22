const ProductCategory = require('../models/productCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdCategory: response ? response : 'Cannot created product-category',
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select('title _id');
  return res.status(200).json({
    success: response ? true : false,
    categories: response ? response : 'Categories not found!',
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;

  const response = await ProductCategory.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    updateCategories: response ? response : 'Cannot update category',
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(cid);
  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `Deleted category ${response.title}`
      : 'Cannot delete category',
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createProduct: newProduct ? newProduct : 'Cannot creat Product',
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);

  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : 'Cannot creat Product',
  });
});

//Filtering, sorting and pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // tách các trường đặc biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operators cho đúng  cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueries = JSON.parse(queryString);

  // 1. Filtering
  if (queries?.title)
    formatQueries.title = { $regex: queries.title, $options: 'i' };
  let queryCommand = Product.find(formatQueries);

  // 2. Sorting
  if (req.query.sort) {
    // abc,kjh => split => ['abc', 'kjh'] => join => abc kjh
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }

  // 3. field Limiting
  // title,price => ['title', 'price'] => title price
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    queryCommand.select(fields);
  }

  // 4. Pagination
  // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Product.find(formatQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      products: response ? response : 'product not found',
      counts,
    });
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updateProduct: updateProduct ? updateProduct : 'Cannot update product',
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const response = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: response ? true : false,
    message: response
      ? `Deleted product name: ${response.title}`
      : `No product found`,
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error('Missing inputs');
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  // console.log(!!alreadyRating);
  if (alreadyRating) {
    // update star
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          'ratings.$.star': star,
          'ratings.$.comment': comment,
        },
      },
      { new: true }
    );
  } else {
    // add star & comment
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  // sum ratings
  const updateProduct = await Product.findById(pid);
  const ratingCount = updateProduct.ratings.length;
  const sumRatings = updateProduct.ratings.reduce(
    (sum, element) => (sum += element.star),
    0
  );

  updateProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;
  await updateProduct.save();

  return res.status(200).json({
    success: true,
    updateProduct,
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
};

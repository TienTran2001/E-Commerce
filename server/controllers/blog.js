const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error('Missing inputs');

  const response = await Blog.create(req.body);

  return res.status(200).json({
    success: response ? true : false,
    newBlog: response ? response : 'Cannot create blog',
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    blogs: response ? response : 'Blog not found',
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updateBlog: response ? response : 'Cannot update blog',
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Blog.findByIdAndDelete(bid);
  return res.status(200).json({
    success: response ? true : false,
    updateBlog: response ? `Deleted blog ${response.title}` : 'Blog not found',
  });
});

// Like and Dislike
/**
 * Khi người dùng like trong blog thì: 
 * 1.Check xem người dùng có dislike ko => bỏ dislike
 * 2. Check xem người dùng có like hay không => bỏ like / thêm like
$pull
$push
 */

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error('Missing inputs');
  const blog = await Blog.findById(bid);
  const isDislike = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id }, $push: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response,
    });
  }

  const isLike = blog?.likes?.find((el) => el.toString() === _id);
  if (isLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error('Missing inputs');
  const blog = await Blog.findById(bid);

  const isLike = blog?.likes?.find((el) => el.toString() === _id);
  if (isLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id }, $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response,
    });
  }

  const isDislike = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      response: response,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberView: 1 } }, // $inc -> query operator -> increment
    { new: true }
  )
    .populate('likes', 'firstName lastName')
    .populate('dislikes', 'firstName lastName');
  return res.status(200).json({
    success: blog ? true : false,
    response: blog,
  });
});

const uploadImageBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error('Missing inputs');
  const response = await Blog.findByIdAndUpdate(
    bid,
    {
      image: req.file.path,
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    updatedBlog: response ? response : 'Cannot update image',
  });
});

module.exports = {
  createNewBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  getBlog,
  uploadImageBlog,
};

const userRouter = require('./user');
const productRouter = require('./product');
const productCategoryRouter = require('./productCategory');
const blogCategoryRouter = require('./blogCategory');
const blogRouter = require('./blog');
const brandRouter = require('./brand');
const couponRouter = require('./coupon');
const { notFound, errHandler } = require('../middlewares/errHandler');
const appRouter = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/product', productRouter);
  app.use('/api/category', productCategoryRouter);
  app.use('/api/blogcategory', blogCategoryRouter);
  app.use('/api/blog', blogRouter);
  app.use('/api/brand', brandRouter);
  app.use('/api/coupon', couponRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = appRouter;

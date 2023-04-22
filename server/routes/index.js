const userRouter = require('./user');
const productRouter = require('./product');
const productCategoryRouter = require('./productCategory');
const blogCategoryRouter = require('./blogCategory');
const { notFound, errHandler } = require('../middlewares/errHandler');
const appRouter = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/product', productRouter);
  app.use('/api/category', productCategoryRouter);
  app.use('/api/blogcategory', blogCategoryRouter);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = appRouter;

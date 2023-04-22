const router = require('express').Router();
const controller = require('../controllers/blogCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], controller.createBlogCategory);
router.get('/', controller.getBlogCategories);
router.delete(
  '/:bcid',
  [verifyAccessToken, isAdmin],
  controller.deleteBlogCategory
);
router.put(
  '/:bcid',
  [verifyAccessToken, isAdmin],
  controller.updateBlogCategory
);

module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/blog');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const upload = require('../config/cloundinary.config');

router.post('/', [verifyAccessToken, isAdmin], controller.createNewBlog);
router.get('/', controller.getBlogs);
router.put('/like/:bid', [verifyAccessToken], controller.likeBlog);
router.put('/dislike/:bid', [verifyAccessToken], controller.dislikeBlog);
router.put(
  '/uploadimage/:bid',
  [verifyAccessToken, isAdmin],
  upload.single('image'),
  controller.uploadImageBlog
);
router.put('/:bid', [verifyAccessToken, isAdmin], controller.updateBlog);
router.delete('/:bid', [verifyAccessToken, isAdmin], controller.deleteBlog);
router.get('/one/:bid', controller.getBlog);
module.exports = router;

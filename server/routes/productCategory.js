const router = require('express').Router();
const controller = require('../controllers/productCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], controller.createCategory);
router.get('/', controller.getCategories);
router.delete('/:cid', [verifyAccessToken, isAdmin], controller.deleteCategory);
router.put('/:cid', [verifyAccessToken, isAdmin], controller.updateCategory);

module.exports = router;

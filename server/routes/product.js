const router = require('express').Router();
const controller = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], controller.createProduct);
router.get('/:pid', controller.getProduct);
router.get('/', controller.getAllProducts);
router.put('/:pid', [verifyAccessToken, isAdmin], controller.updateProduct);

module.exports = router;

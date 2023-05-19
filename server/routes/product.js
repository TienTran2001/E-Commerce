const router = require('express').Router();
const controller = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloundinary.config');

router.post('/', [verifyAccessToken, isAdmin], controller.createProduct);
router.get('/', controller.getProducts);
router.put('/ratings', [verifyAccessToken], controller.ratings);

router.put(
  '/uploadimage/:pid',
  [verifyAccessToken, isAdmin],
  uploader.array('images', 10),
  controller.uploadImageProduct
);
router.delete('/:pid', [verifyAccessToken, isAdmin], controller.deleteProduct);
router.get('/:pid', controller.getProduct);
router.put('/:pid', [verifyAccessToken, isAdmin], controller.updateProduct);

module.exports = router;

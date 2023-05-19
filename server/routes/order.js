const router = require('express').Router();
const controller = require('../controllers/order');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', verifyAccessToken, controller.createOrder);
router.get('/admin', [verifyAccessToken, isAdmin], controller.getOrders);
router.get('/', verifyAccessToken, controller.getUserOrder);
router.put(
  '/status/:oid',
  [verifyAccessToken, isAdmin],
  controller.updateStatus
);

module.exports = router;

const router = require('express').Router();
const controller = require('../controllers/insertData');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloundinary.config');

router.post('/', controller.insertProduct);
router.post('/cate', controller.insertCategory);

module.exports = router;

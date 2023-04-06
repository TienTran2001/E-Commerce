const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/register', controller.register);
module.exports = router;
//CRUD create read update delete -> post get put delete

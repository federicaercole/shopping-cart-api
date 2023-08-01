const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/', apiController.getHomeProducts)

router.get('/:id', apiController.getSingleProduct);

router.get('/category/:category', apiController.getProducts);

module.exports = router;
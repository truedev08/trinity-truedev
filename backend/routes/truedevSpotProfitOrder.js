const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const SpotProfitOrder = require('../controllers/truedevSpotProfitOrder')
// Public - token created

router.post('/createOrder', SpotProfitOrder.createOrder)

router.post('/cancelOrder', SpotProfitOrder.cancelOrder)

router.get('/requestConditions', SpotProfitOrder.requestConditions)

module.exports = router;
const express = require('express')
const router = express.Router()
const cartController = require('../../controller/saleController/cartController')

router.get('/add/:product',cartController.addProductCart)
router.get('/checkout',cartController.checkOutCart)
router.get('/update/:product',cartController.updateCart)
router.get('/clear',cartController.clearCart)
router.get('/buynow',cartController.buyNow)

module.exports = router
const express = require('express')
const router = express.Router()
const productController = require('../../../controller/saleController/productController')
const upload = require('../../../middleWare/storageUpload')


router.get('/addproduct',productController.addProduct)
router.post('/addproduct' ,productController.addedProduct)
router.get('/editproduct/:id' ,productController.editProduct)
router.post('/editproduct/:id' ,productController.editedProduct)
router.post('/productgallery/:id' ,productController.productGallery)
router.get('/productgallery/deleteimage/:image' ,productController.deleteGalaryImage)
router.get('/deleteproduct/:id' ,productController.deleteProduct)
router.get('/allproduct', productController.allProduct)
// Product detail
router.get('/:category/:product', productController.productDetail)
router.get('/:category', productController.productByCategory)
router.get('/',productController.listProduct)


module.exports = router
const express = require('express')
const router = express.Router()
const salePageController = require('../../controller/saleController/categoryController')

router.get('/listpage',salePageController.listPage)
router.get('/category',salePageController.allCategory)
router.get('/category/add',salePageController.getCategory)
router.post('/category/add',salePageController.addCategory)
router.get('/category/edit/:slug',salePageController.editCategory)
router.post('/category/edit/:slug',salePageController.editedCategory)
router.get('/category/delete/:id',salePageController.deleteCategory)


router.get('/',salePageController.salePage) //Home

module.exports = router

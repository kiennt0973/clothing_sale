const express = require('express')
const router = express.Router()
const saleAdminController = require('../../controller/saleController/pageController')


router.get('/addpage',saleAdminController.getAddPage)
router.post('/addpage',saleAdminController.submitAddPage)
router.get('/editpage/:slug',saleAdminController.getEditPage)
router.post('/editpage/:slug',saleAdminController.submitEditPage)
router.get('/deletepage/:id',saleAdminController.deletePage)


router.get('/',saleAdminController.adminPage)


module.exports = router
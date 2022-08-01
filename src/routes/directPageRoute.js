const express = require('express')
const router = express.Router()
const pageController = require('../controller/pageController')


router.get('/',pageController.home)
module.exports = router
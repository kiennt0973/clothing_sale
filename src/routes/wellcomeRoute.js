const express = require('express')
const router = express.Router()
const wellcomeController = require('../controller/wellcomeController')
const wellcomeMiddle = require('../middleWare/wellcomeMiddle')

router.get('/',wellcomeMiddle , wellcomeController.home)


module.exports = router

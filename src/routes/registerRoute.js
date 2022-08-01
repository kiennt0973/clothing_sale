const express = require('express')
const router = express.Router()
const registerContoller = require('../controller/authentication/registerController')

router.get('/', registerContoller.fill)
router.post('/', registerContoller.submit)


module.exports = router
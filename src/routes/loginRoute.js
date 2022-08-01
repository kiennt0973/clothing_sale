const express = require('express')
const  router = express.Router()
const loginControll = require('../controller/authentication/loginController')
const loginMiddle = require('../middleWare/loginMiddle')




// Login Google
router.get('/auth/google', loginMiddle.checkAuthenGoogle)
router.get('/auth/google/callback',loginMiddle.responseGoogle)

// Login Facebook
router.get('/auth/facebook', loginMiddle.checkAuthenFacebook)
router.get('/auth/facebook/callback',loginMiddle.responseFacebook)

router.get('/', loginControll.fill)
//Login Local
router.post('/', loginMiddle.checkAuthenLocal)

module.exports = router
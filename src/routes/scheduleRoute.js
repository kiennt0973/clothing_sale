const express = require('express')
const router = express.Router()
const scheduleController = require('../controller/scheduleController')
const checkRole = require('../middleWare/checkRole')

router.get('/student', checkRole.checkLevel, checkRole.level1, scheduleController.student)
router.get('/teacher', checkRole.checkLevel, checkRole.level2, scheduleController.teacher)
router.get('/admin', checkRole.checkLevel, checkRole.level3, scheduleController.admin)

module.exports = router
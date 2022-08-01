const validatorDB = require('../models/Login_Register_DB')
var jwt = require('jsonwebtoken')
const secret = 'secretkey'


class checkRole {

    checkLevel (req, res, next) {
        try {
            let token = req.cookies.token
            let decode = jwt.verify(token,secret)
            validatorDB.findOne({_id: decode._id})
            .then(data => {
                    req.data = data
                    next()
            })
            .catch(err => {
                res.status(500).json('Tài khoản không tồn tại')
            })
        } catch (error) {
            res.status(500).render('permission/errorToken')
        }
    }

    level1 (req, res, next) {
        try {
            let level = req.data.level
            if (level >= 1){
                next()
            }
        } catch (error) {
            res.render('permission/errorLogin')   
        }
    }

    level2 (req, res, next) {
        try {
            let level = req.data.level
            console.log(level)
            if (level >= 2){
                next()
            } else {
                res.render('permission/deninedPermiss')
            }
        } catch (error) {
            res.render('permission/errorLogin')   
        }
    }

    level3 (req, res, next) {
        try {
            let level = req.data.level
            console.log(level)
            if (level >= 3){
                next()
            } else {
                res.render('permission/deninedPermiss')
            }
        } catch (error) {
            res.render('permission/errorLogin')   
        }
    }
}

module.exports = new checkRole
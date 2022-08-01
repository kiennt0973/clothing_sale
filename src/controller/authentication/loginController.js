const validatorDB = require('../../models/Login_Register_DB')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


// hash password
const bcrypt = require('bcrypt');
//
const secret = 'secretkey'


class loginController {
    fill (req, res, next) {
        res.render('login')
    }

    submit (req, res, next) {
        let username = req.body.username
        let password = req.body.password
        validatorDB.findOne({
            username: username
        })
        .then(data => {
            if(!data) {
                return res.json('Tài khoản không tồn tại')
            } else if (bcrypt.compareSync(password, data.password)) {
                let token = jwt.sign({_id: data._id}, secret, {expiresIn: '2m'})
                // console.log('token:', token)
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,//https thì true
                    sameSite: 'strict' //chống XSS
                })
                return res.status(200).json({
                    message: 'Đăng nhập thành công',
                    token: token
                })
            } else {
                return res.status(401).json('Mật khẩu không đúng')
            }
        })
        .catch(err => {
            return res.status(500).json('Lỗi hệ thống')
        })
    }
}

module.exports = new loginController
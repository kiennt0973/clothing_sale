var jwt = require('jsonwebtoken')
const secret = 'secretkey'


module.exports = function loginMiddleWare (req, res, next){
    let token = req.cookies.token
    try {
        let decoded = jwt.verify(token, secret)
        if(decoded) {next()}
      } catch(err) {
        res.render('permission/errorLogin')
      }
}
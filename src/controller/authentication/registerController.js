const validatorDB = require('../../models/Login_Register_DB')

// hash password
const bcrypt = require('bcrypt');
const saltRounds = 10;
//

class registerContoller {
    fill(req, res){
        res.render('register')
    }
    submit(req, res){
        let username = req.body.username
        let hashPassword = bcrypt.hashSync(req.body.password, saltRounds);  
        validatorDB.findOne({
            username: username
        })
        .then(data => {
            if(data) {
                res.json('tai khoan da ton tai')
            } else {
                console.log(hashPassword)
                validatorDB.create({
                    username: username,
                    password: hashPassword,
                    level: 1
                })
                .then(data => {
                    res.json('tao tai khoan thanh cong')
                })
            }
        })
        .catch(err => {
        res.status(500).json('tao tai khoan that bai')
        })
    }
       
    
}

module.exports = new registerContoller
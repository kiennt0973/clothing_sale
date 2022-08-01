const pageSaleDB = require('../models/pageSaleDB')

class homeController{
    home(req,res,next){
        res.render('home',{
        })
    }
}

module.exports = new homeController
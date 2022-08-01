const pageSaleDB = require('../../models/pageSaleDB')
const categoryDB = require('../../models/categoryDB')


class salePageController {

    salePage(req, res, next){
        res.render('home')
    }

    listPage(req, res, next){
        pageSaleDB.find({}).sort({sorting: 1}).lean().exec((err, data)=> {
            res.render('sale/listPage',{
                pages: data,
                TITLE: 'List Page',
                home: '1'
            })
        })
    }
    
    allCategory(req, res, next){
        categoryDB.find({}).lean().exec((err, data) =>{
            if(err){res.json('Err connect DB')}
            res.render('sale/category/allCategory',{
                pages: data,
                TITLE: 'Category'
            })
        })
    }

    getCategory(req, res, next){
        res.render('sale/category/addCategory',{TITLE: 'Add Category'})
    }
    
    addCategory(req, res, next){
        const errors = []
        const title = req.body.title
        let slug = '/' + title
        if(title === ''){ errors.push('Title is required') }
        // check value
        if(errors.length) {
            res.render('sale/category/addCategory',{
                errors: errors,
                title: title,
                slug: slug,
                TITLE: 'Add Category'
                // layout: 'pageLayout.hbs'
            })
        } else {
            // check DB
            categoryDB.findOne({slug: slug})
            .then(async data => {
                if (data) {
                    res.render('sale/category/addCategory',{
                    error: 'Slug is exists',    
                    title: data.title,
                    TITLE: 'Add Category'
                    // layout: 'pageLayout.hbs'
                    })
                } else {
                    await categoryDB.create({
                        title: title,
                        slug: slug,
                    })
                }   
                await categoryDB.find({}).lean().exec((err,category)=>{
                    if(err){console.log(err)}
                    req.app.locals.CATEGORY = category
                })
                res.redirect('/sale/category')
            })  
            .catch(err => {
                res.status(500).json('Error connect DB')
            })                      
        }
    }

    editCategory(req, res, next){
        const Slug = '/' + req.params.slug
        categoryDB.findOne({slug: Slug}, (err, data) =>{
            if(err) {return console.log('Error connect DB')}
            if(!data) {return res.json('Link is invalid')}
            res.render('sale/category/editCategory',{
                title: data.title,
                slug: data.slug,
                TITLE: 'Add Category'
            })
        })
    }

    editedCategory(req, res, next){
        const errors = []
        const title = req.body.title
        let Slug = '/' + title
        if(title === ''){ errors.push('Title is required') }
        // check value
        if(errors.length) {
            return res.render('sale/category/addCategory',{
                errors: errors,
                title: title,
                slug: slug,
                TITLE: 'Add Category'
                // layout: 'pageLayout.hbs'
            })
        } else {
            // check DB
            categoryDB.findOneAndUpdate({slug: '/' + req.params.slug},{
                title: title,
                slug: Slug,
            })
            .then(async data => {
                if(!data) {res.json('invalid')}
                if (data) {
                    await categoryDB.find({}).lean().exec((err,category)=>{
                        if(err){console.log(err)}
                        req.app.locals.CATEGORY = category
                    })
                    return res.redirect('/sale/category')
                }   
            })  
            .catch(err => {
                return res.status(500).json('Error connect DB')
            })                      
        }
    }

    deleteCategory(req, res, next){
        categoryDB.findOneAndDelete({_id: req.params.id}, (err, data) =>{
            if (err){
                res.status(500).json('Error connect DB')
            }
            categoryDB.find({}).lean().exec((err,category)=>{
                if(err){console.log(err)}
                req.app.locals.CATEGORY = category
            })
            res.redirect('/sale/category')
        })
    }
}

module.exports = new salePageController


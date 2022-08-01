
const pageSaleDB = require('../../models/pageSaleDB')
const counter = require('../../models/counterInDB')

class adminPageController {

    adminPage(req, res, next){
        res.render('sale/adminPage/adminPage')
    }

    getAddPage(req, res, next){
        
        const title = ''
        const slug = ''
        const content = ''

        res.render('sale/adminPage/addPage',{
            title: title,
            slug: slug,
            content: content,
            TITLE: 'Add Page'
            // layout: 'pageLayout.hbs'
        })
    }

    submitAddPage(req, res, next){

        const errors = []
        const title = req.body.title
        let slug = '/' + req.body.slug
        if(req.body.slug === '') {slug = slug + title}
        slug = slug.replace(' ','_')
        const content = req.body.content
        if(title === ''){ errors.push('Title is required') }
        if(content === ''){ errors.push('Content is required') }

        // check value
        if(errors.length) {
            res.render('sale/adminPage/addPage',{
                errors: errors,
                title: title,
                slug: slug,
                content: content,
                TITLE: 'Add Page'

                // layout: 'pageLayout.hbs'
            })
        } else {
            // check DB
            pageSaleDB.findOne({slug: slug})
            .then(data => {
                if (data) {
                    res.render('sale/adminPage/addPage',{
                    error: 'Slug is exists',    
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    TITLE: 'Add Page'
                    // layout: 'pageLayout.hbs'
                    })
                } else {
                    counter.findOneAndUpdate({id: 'counter'}, {$inc: { seq: 1} },async function(error, counter)   {
                        if(error) return next(error)
                        await pageSaleDB.create({
                            title: title,
                            slug: slug,
                            content: content,
                            sorting: counter.seq
                        })
                        pageSaleDB.find({}).sort({sorting: 1}).lean().exec((err,pages)=>{
                        if(err){console.log(err)}
                        req.app.locals.PAGES = pages
                        })
                    })
                    res.redirect('/sale/listpage')
                }   
            })  
            .catch(err => {
                res.status(500).json('Error connect DB')
            })                      
        }
    }

    // Edit Page
    getEditPage(req, res, next){
        const Slug = '/' + req.params.slug
        pageSaleDB.findOne({slug: Slug}, (err, data) =>{
            if(err) {return console.log('Error connect DB')}
            if(!data) {return res.json('Link is invalid')}
            res.render('sale/adminPage/editPage',{
                title: data.title,
                slug: data.slug,
                content: data.content,
                TITLE: 'Edit Page'
            })
        })
    }

    submitEditPage(req, res, next){
        const errors = []
        const title = req.body.title
        let slug = req.body.slug
        if(req.body.slug === '') {slug = slug + title}
        const content = req.body.content
        if(title === ''){ errors.push('Title is required') }
        if(content === ''){ errors.push('Content is required') }

        // check value
        if(errors.length) {
            res.render('sale/adminPage/editPage',{
                title: title,
                slug: slug,
                content: content,
                TITLE: 'Edit Page'
                // layout: 'pageLayout.hbs'
            })
        } else {
            // check DB
            pageSaleDB.findOneAndUpdate({slug: '/' + req.params.slug},{
                title: title,
                slug: slug,
                content: content
            })
            .then(data => {
                if (data) {
                    pageSaleDB.find({}).sort({sorting: 1}).lean().exec((err,pages)=>{
                        if(err){console.log(err)}
                        req.app.locals.PAGES = pages
                    })
                    res.redirect('/sale/listpage')
                }   
            })  
            .catch(err => {
                res.status(500).json('Error connect DB')
            })                      
        }
    }

    deletePage(req, res, next){
        pageSaleDB.findOneAndDelete({_id: req.params.id}, (err, data) =>{
            if (err){
                res.status(500).json('Error connect DB')
            }
            pageSaleDB.find({}).sort({sorting: 1}).lean().exec((err,pages)=>{
                if(err){console.log(err)}
                req.app.locals.PAGES = pages
            })
            res.redirect('/sale/listpage')
        })
    }

}

module.exports = new adminPageController
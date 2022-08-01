const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img')
const productDB = require('../../models/productDB')
const categoryDB = require('../../models/categoryDB')

// const fileUpload = require('express-fileupload')


class product{
    listProduct(req, res, next){
        let count
        productDB.count({},(err, c)=>{
            count = c
        })
        productDB.find({}).lean().exec((err, products)=>{
            res.render('sale/product/listProduct',{
                products: products,
                count: count,
                TITLE: 'List Product'
            })
        })
    }

    addProduct(req, res, next){
        const title = ''
        const desc = ''
        const price = ''

        categoryDB.find({}).lean().exec((err, category)=>{
            res.render('sale/product/addProduct',{
                title: title,
                desc: desc,
                categories: category,
                price: price,
                TITLE: 'Add Product'
            })
        })
    }

    addedProduct(req, res, next){
        const errors = []
        const title = req.body.title
        let slug = '/' + title.replace(/\s+/g,'-').toLowerCase()
        const desc = req.body.desc
        const price = req.body.price
        const category = req.body.category
        
        const imageFile = (req.files !== null) ? (Date.now() + '-' + req.files.image.name) : '' 
        if(title === ''){ errors.push('Title is required') }
        if(desc === ''){ errors.push('Description is required') }
        if(imageFile === ''){ errors.push('You have to upload image') }
        if(price === '' ){ errors.push('Price is required and must have value > 0') }
        if(parseFloat(price) <= 0 ){ errors.push('Price is required and must have value > 0') }


        // check value
        if(errors.length) {
            categoryDB.find({}).lean().exec((err, category)=>{
                res.render('sale/product/addProduct',{
                    errors: errors,
                    title: title,
                    desc: desc,
                    categories: category,
                    price: price,
                    TITLE: 'Add Product'
                    // layout: 'pageLayout.hbs'
                })
            })
        } else {
            // check DB
            productDB.findOne({slug: slug})
            .then(product => {
                if (product) {
                    errors.push('Title is exists')
                    categoryDB.find({}).lean().exec((err, category)=>{
                        res.render('sale/product/addProduct',{
                            errors: errors,
                            title: title,
                            desc: desc,
                            categories: category,
                            price: price,
                            TITLE: 'Add Product'
                            // layout: 'pageLayout.hbs'
                        })
                    })
                } else {
                    productDB.create({
                        title: title,
                        desc: desc,
                        category: category,
                        price: parseFloat(price).toFixed(2),
                        slug: slug,
                        image: imageFile
                    })
                    .then( async p=>{
                        await mkdirp('./src/public/uploads/' + p._id)
                        await mkdirp('./src/public/uploads/' + p._id + '/gallery')
                        await mkdirp('./src/public/uploads/' + p._id + '/gallery/thumbs')
                        if(imageFile !== ''){
                            const productImage = req.files.image
                            const path = './src/public/uploads/' + p._id + '/' + p.image
                            productImage.mv(path)
                        }
                        res.redirect('/product')
                    })
                }   
            })  
            .catch(err => {
                res.status(500).json('Error connect DB')
            })                      
        }
    }

    editProduct(req, res, next){

        categoryDB.find({}).lean().exec((err, category)=>{
            productDB.findOne({_id: req.params.id}).lean().exec(async (err, p)=>{
                if(!p) {return res.json('item is not invalid')}
                const galleryDir = './src/public/uploads/' + p._id + '/gallery'
                fs.readdir(galleryDir,(err,files)=>{
                    let galleryFiles = files
                    res.render('sale/product/editProduct',{
                        title: p.title,
                        desc: p.desc,
                        categories: category,
                        category: p.category,
                        price: p.price,
                        image: p.image,
                        _id: p._id,
                        TITLE: 'Edit Product',
                        galleryFiles: galleryFiles
                    })                     
                }) 
            })
        })
    }
    
    editedProduct(req, res, next){
        const errors = []
        const title = req.body.title
        let slug = '/' + title.replace(/\s+/g,'-').toLowerCase()
        const desc = req.body.desc
        const price = req.body.price
        const category = req.body.category
        const pimage = req.body.pimage
        const id = req.params.id
        
        const imageFile = (req.files !== null) ? (Date.now() + '-' + req.files.image.name) : '' 
        if(title === ''){ errors.push('Title is required') }
        if(desc === ''){ errors.push('Description is required') }
        if(price === '' ){ errors.push('Price is required and must have value > 0') }
        if(parseFloat(price) <= 0 ){ errors.push('Price is required and must have value > 0') }

        if(errors.length) {
            return res.redirect('/product/editproduct/' + id)            
        } else {
            productDB.findOne({slug: slug, _id: {'$ne': id}}).lean().exec(async(err, PD)=>{
                if(err){console.log(err)}
                if(PD){
                    return res.redirect('/product/editproduct/' + id)            
                } else {
                    productDB.findOneAndUpdate({_id: id},{
                        title : title,
                        slug : slug,
                        desc : desc,
                        price : parseFloat(price).toFixed(2),
                        category : category,
                    },(err,p)=>{
                        if(imageFile !== ''){
                            p.image = imageFile
                        } 
                        p.save()
                    })
                    if(err){res.json(err)}
                    if(imageFile !== ''){
                        if(pimage !== ''){
                            fs.remove('./src/public/uploads/' + id + '/' + pimage)
                        }

                        const productImage = req.files.image
                        const path = './src/public/uploads/' + id + '/' + imageFile
                        productImage.mv(path)
                    }
                    res.redirect('/product')
                }
            })
        }
    }

    productGallery(req, res, next){
        const productImage = req.files.file
        const id = req.params.id
        const detailImage = Date.now() + '-' + req.files.file.name
        const path = './src/public/uploads/' + id + '/gallery/' + detailImage
        const thumsPath = './src/public/uploads/' + id + '/gallery/thumbs/' + detailImage

            productImage.mv(path, (err)=>{
                if(err){res.status(500).json('Error in server side')}
                resizeImg(fs.readFileSync(path),{width: 100, height:100})
                .then((buf)=>{
                    fs.writeFileSync(thumsPath, buf)
                })
            })

        res.redirect('/product')
    }

    deleteGalaryImage(req, res, next){
        const originalImage = './src/public/uploads/' + req.query.id + '/gallery/' + req.params.image
        const thumsImage = './src/public/uploads/' + req.query.id + '/gallery/thumbs/' + req.params.image

        fs.remove(originalImage,(err)=>{
            if(err){console.log(err)}
            fs.remove(thumsImage,(err)=>{
                if(err){console.log(err)}
                res.redirect('/product/editproduct/'+req.query.id)
            })
        })
    }

    deleteProduct(req, res, next){
        const id = req.params.id
        const path = './src/public/uploads/' + id
        fs.remove(path,(err)=>{
            if(err){console.log(err)}
        })
        productDB.findOneAndDelete({_id: id},(err,data)=>{
            if (err){
                res.status(500).json('Error connect DB')
            }
            res.redirect('/product')
        })
    }

    allProduct(req, res, next){
        productDB.find({}).lean().exec(async (err, p)=>{
            if(err){console.log(err)}
            res.render('sale/product/renderProduct',{
                product: p,
                TITLE: 'All Product',
                price: parseFloat(p[0].price).toFixed(2),
                layout: 'pageLayout.hbs'
            })
        })
    }

    // GET product by category
    productByCategory(req,res,next){
        let categorySlug = req.params.category
        categoryDB.findOne({slug: categorySlug}).lean().exec(async (err,c)=>{
            await productDB.find({category: '/'+categorySlug}).lean().exec(async (err, p)=>{
                if(err){console.log(err)}
                res.render('sale/product/renderProduct',{
                    TITLE: p[0].category.replace('/',''),
                    product: p,
                    layout: 'pageLayout.hbs',
                })
            })
        })
        
    }

    productDetail(req,res){
        productDB.findOne({slug: '/' + req.params.product}).lean().exec(async (err, p)=>{
            if(err){console.log(err)}
            if(!p){return res.json('null')}
            const galleryDir = './src/public/uploads/' + p._id + '/gallery'
            fs.readdir(galleryDir,(err, files)=>{
                let galleryImage = files
                    res.render('sale/product/detailProduct',{
                        product: p,
                        ctg: p.category.replace('/',''),
                        Price: parseFloat(p.price).toFixed(2),
                        gallery_image: galleryImage,
                        layout: 'pageLayout.hbs',
                        TITLE: p.title,
                    })
                })
        })
    }

}

module.exports = new product
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const route = require('./src/routes/routes')
const validatorDB = require ('./src/models/Login_Register_DB')
const session = require('express-session')


// file upload
const fileUpload = require('express-fileupload')
app.use(fileUpload())


// connect database
const db = require('./src/config/configdb')
db.connect()


//setup cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// template engine
app.engine('.hbs', handlebars.engine({extname: '.hbs',
    // runtimeOptions: {
    //     allowProtoPropertiesByDefault: true,
    //     allowProtoMethodsByDefault: true
    // },
    helpers: {
        compare: (image, id) => {
            if(image === ''){ 
                return  `<img style="width:100px; height:100px;" src="/img/noImage.jpg">`
            } else {
                return `<img style="width:100px; height:100px;" src="/uploads/${id}/${image}">`
            }
        }, split: (string) =>{
            return str = string.split('/')[1]
        }, galleryImage: (files,id)=>{
            return files.map((file)=>{
                if(file !== 'thumbs'){ 
                    return `
                    <li style="list-style-type: none" class="mt-4">
                    <img style="width:100px; height:100px;" src="/uploads/${id}/gallery/thumbs/${file}">
                    <a class="confirmDelete" href="/product/productgallery/deleteimage/${file}?id=${id}">delete</a>
                    </li>
                    `
                } 
            }).join('')
        }, allProduct: (products)=>{
            return products.map((p)=>{
                let Price = parseFloat(p.price).toFixed(2)

            return `<div class="col-xs-12 col-md-4 mt-4 products rounded border">
            <a class="pa" href="/product${p.category}${p.slug}">
                <img class="pimage" src="/uploads/${p._id}/${p.image}" alt=" ">
            </a>
            <h3>${p.title}</h3>
            <h4>$${Price}</h4>
            <a class="vd" href="/product${p.category}${p.slug}">View Details</Details></a>
            </div>
            `
            }).join('')
        }, detailProduct: (galleryImage, products)=>{
            return galleryImage.map((image)=>{
                if(image !== 'thumbs') {
                    return `
                    <li>
                        <a data-fancybox="gallery" href="/uploads/${products._id}/gallery/${image}">
                            <img src="/uploads/${products._id}/gallery/thumbs/${image}" alt=" ">
                        </a>
                    </li>
                    `
                }
            }).join('')
        }, countCart: (cart)=>{
            if(typeof(cart) !== 'undefined'){
                return cart.length
            } else {
                return 0
            }
        }, checkOut: (carts)=>{
            return carts.map((cart)=>{
                let subtotal = parseFloat(cart.qty * cart.price).toFixed(2)
                return `
                <tr>
                    <td><img class="api" src="${cart.image}" alt=" "></td>
                    <td>${cart.title}</td>
                    <td>${cart.price}</td>
                    <td>${cart.qty}</td>
                    <td>
                        <div>
                        <a style="display: inline-block; padding: 5px;" href="/cart/update/${cart.title}?action=add"><p>+</p></a>
                        <a style="display: inline-block; padding: 5px;" href="/cart/update/${cart.title}?action=remove"><p>-</p></a>
                        <a style="display: inline-block; padding: 5px;" href="/cart/update/${cart.title}?action=clear"><p>Clear</p></a>
                        </div>
                    </td>
                    <td>$${subtotal}</td>
                </tr>
                `
            })
        }, PayPal: (carts)=>{
            let num =0
            return carts.map((cart)=>{
                num++
                return `
                <input type="hidden" name="item_name_${num}" value="${cart.title}">
                <input type="hidden" name="amount_${num}" value="${cart.price}">
                <input type="hidden" name="quantity_${num}" value="${cart.qty}">
                `
            })
        }
    }
}))
app.set('view engine', '.hbs')
app.set('views', './src/views')
// default layout
app.set('view options', { layout: 'other' });



// static public
const path = require('path')
app.use(express.static(path.join(__dirname, '/src/public')))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// bodyParser
app.use(bodyParser.json())

// http log
app.use(morgan('combined'))


// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// Variable Loacl
const pageSaleDB = require('./src/models/pageSaleDB')
const categoryDB = require('./src/models/categoryDB')
const productDB = require('./src/models/productDB')
pageSaleDB.find({}).sort({sorting: 1}).lean().exec((err,pages)=>{
    if(err){console.log(err)}
    app.locals.PAGES = pages
})
categoryDB.find({}).lean().exec((err,category)=>{
    if(err){console.log(err)}
    app.locals.CATEGORY = category
})
productDB.find({}).lean().exec((err,product)=>{
    if(err){console.log(err)}
    app.locals.PRODUCT = product
})

app.get('*',(req,res,next)=>{
    res.locals.cart = req.session.cart
    next()
})

// routing
route(app)

app.get('*', function(req, res){
    res.status(404)
    res.sendFile(path.join(__dirname, 'src/views/','Eror404.html'))
  });

// set variable global
app.locals.errors = null

const port = 80
app.listen(port, () => {
    console.log(`server listening on localhost:${port}`)})


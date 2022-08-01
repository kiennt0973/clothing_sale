const productDB = require('../../models/productDB')

class cartController{
    
    addProductCart(req,res){
        let slug = req.params.product
        
        productDB.findOne({slug: '/'+ slug}).lean().exec((err,p)=>{
            if(err){return res.json(err)}
            if(typeof(req.session.cart) === 'undefined'){
                req.session.cart = []
                req.session.cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/uploads/'+ p._id + '/' + p.image
                })
            } else {
                let cart = req.session.cart
                let newItem = true
                for(let i=0;i<cart.length;i++){
                    if(cart[i].title == slug){
                        cart[i].qty++
                        newItem = false
                        break
                    }
                }
                if(newItem){
                    cart.push({
                        title: slug,
                        qty: 1,
                        price: parseFloat(p.price).toFixed(2),
                        image: '/uploads/'+ p._id + '/' + p.image
                    })
                }
            }
            res.redirect('back')
        })
    }
    
    checkOutCart(req,res,next){
        // productDB.findOne({slug: 'home'})
        let cart = req.session.cart
        let totalBill = 0
        if(cart && cart.length == 0){
            delete req.session.cart
        } else {
            if(typeof(cart) !== 'undefined'){
                for(let i=0;i<cart.length;i++){
                    totalBill = totalBill + parseFloat(cart[i].price * cart[i].qty)
                }
                totalBill = parseFloat(totalBill).toFixed(2)
            }
            res.render('sale/product/checkOut',{
                cart: cart,
                totalBill: totalBill,
                TITLE: 'Check Out'
                // layout: 'pageLayout.hbs'
            })
        }
    }

    updateCart(req,res,next){
        const slug = req.params.product
        let cart = req.session.cart
        for(let i=0;i<cart.length;i++){
            if(cart[i].title == slug){                 
                switch (req.query.action) {
                    case 'add':
                        cart[i].qty++
                        break
                    case 'remove':
                        cart[i].qty--
                        if(cart[i].qty==0){
                            cart.splice(i,1) 
                        }
                        break
                    case 'clear':
                        cart.splice(i,1) 
                        if(cart.length ==0){delete req.session.cart}
                        break        
                    default:
                        console.log('Update Problem');
                        break
                }
                break
            }
        }
        res.redirect('back')
    }

    clearCart(req,res){
        delete req.session.cart
        res.redirect('back')
    }

    buyNow(req,res){
        delete req.session.cart
        res.status(200).json('Loading Paypal')
    }
}

module.exports = new cartController
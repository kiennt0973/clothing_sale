const loginRouter = require('./loginRoute')
const registerRouter = require('./registerRoute')
const wellcomeRouter = require('../routes/wellcomeRoute')
const scheduleRouter = require('../routes/scheduleRoute')
const pageRouter = require('./saleRoute/pageRoute')
const categoryRouter = require('./saleRoute/categoryRoute')
const productRouter = require('./saleRoute/product/productRoute')
const directPageRouter = require('./directPageRoute')
const cartRouter = require('./saleRoute/cartRoute')

function route (app) {
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/wellcome',wellcomeRouter)
    app.use('/schedule',scheduleRouter)
    app.use('/sale/admin', pageRouter)
    app.use('/sale', categoryRouter)
    app.use('/product', productRouter)
    app.use('/page/:slug',directPageRouter)
    app.use('/cart',cartRouter)

    app.use('/',directPageRouter)
}

module.exports = route
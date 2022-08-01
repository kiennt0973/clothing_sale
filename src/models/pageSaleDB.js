const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pageSale = new Schema ({
    title: {
        type: String
    }, slug: {
        type: String
    }, content: {
        type: String
    }, sorting: {
        type: Number, default: 1
    }
}) 

pageSaleDB = mongoose.model('pagesaledbs', pageSale)

module.exports = pageSaleDB
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema ({
    title: {
        type: String
    }, slug: {
        type: String
    }, desc: {
        type: String
    }, category: {
        type: String
    }, price: {
        type: Number
    }, image: {
        type: String
    }, 
}) 

productDB = mongoose.model('products', Product)

module.exports = productDB
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categories = new Schema ({
    title: {
        type: String
    }, slug: {
        type: String
    }
}) 

categoryDB = mongoose.model('categories', categories)

module.exports = categoryDB
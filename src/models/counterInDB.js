const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CounterSchema = Schema({
    id: {type: String, required: true},
    seq: { type: Number }
});
const counter = mongoose.model('counters', CounterSchema)

module.exports = counter

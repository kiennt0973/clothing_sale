const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');


const Login_Register = new Schema({
    username: {
      type: String, 
      require: true
    },password: {
      type: String, 
      require: true 
    },level: {
      type: Number,
    },googleID: {
      type: String,
    },facebookID: {
      type: String,
    },email: {
      type: String,
    }
  })

Login_Register.plugin(passportLocalMongoose)

  const validators = mongoose.model('validators', Login_Register)

// plugin for passport-local-mongoose
  
  module.exports = validators


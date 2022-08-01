//  Passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy
const FacebookStrategy = require('passport-facebook')
const validatorDB = require ('../models/Login_Register_DB.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret = 'secretkey'



// thêm gói cho passport
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    validatorDB.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.initialize() // kiểm tra session lấy ra passport.user nếu chưa có thì tạo rỗng.

// login local
passport.use('login', new LocalStrategy({passReqToCallback : true}, async function (req, username, password, done) {
    validatorDB.findOne({
        username: username,
    })
    .then( async data => {
        if(!data) { return done(null,false) }
        let Password = await bcrypt.compareSync(password, data.password)
        if (!Password) { return done(null,false) }
        return done(null,data)
    })
    .catch(err => {
        return done(err) //Khi không kết nối được database
    })
  }));


  // Authen Google
  passport.use('google',new GoogleStrategy({
    clientID: '92428976346-kc1mpipuou96mp7r9hpn9fdgd8er973g.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost/login/auth/google/callback",
    passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        validatorDB.findOne({
            googleID: profile.id
        })
        .then(data => {
            if(data) {
            return done(null, data)
            }
            validatorDB.create({
                googleID: profile.id,
                email: profile.email,
                username: profile.name.familyName + ' ' + profile.name.givenName,
                level: 1
            })
            .then(user => {
                return done(null, data)
            })
        })
        .catch(err => {
            return done(null, err)
        })
  }));

  
  // Authen Facebook
  passport.use(new FacebookStrategy({
    clientID: '1047951172775510',
    clientSecret: 'ad559c0dc12beb20e9dccb0f2a2d989a',
    callbackURL: "http://localhost/login/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // console.log(profile)
        validatorDB.findOne({
            facebookId: profile.id
        })
        .then(data => {
            if(data) {
            return done(null, data)
            }
            validatorDB.create({
                facebookId: profile.id,
                username: profile.displayName,
                level: 1
            })
            .then(user => {
                return done(null, data)
            })
        })
        .catch(err => {
            return done(null, err)
        })
  }))


  // Middle Ware
  class loginMiddle {
    checkAuthenLocal (req, res, next) {
        passport.authenticate('login', (err, user) => {
            if(err) { 
                return res.status(500).json('lỗi server k kết nối được DB') }
            if(!user) { return res.status(401).json('tài khoản hoặc mật khẩu không đúng') }

            let token = jwt.sign({_id: user._id}, secret, {expiresIn: '1m'})
            res.cookie('token',token ,{
                // httpOnly: true,
                secure: false,//https thì true
                sameSite: 'strict' //chống XSS attack
            })
            return res.redirect('/wellcome')
        })(req, res)
    }


    checkAuthenGoogle (req, res, next) {
        passport.authenticate('google', { 
            scope: [ 'email', 'profile' ] }
        )(req, res, next)
    }
    
    responseGoogle(req, res, next){
        passport.authenticate( 'google', (err,user)=>{
            if(err) { 
                return res.status(500).json('lỗi server k kết nối được DB') }
            if(!user) { return res.status(401).json('tài khoản hoặc mật khẩu không đúng') }

            let token = jwt.sign({_id: user._id}, secret, {expiresIn: '1m'})
            res.cookie('token',token ,{
                // httpOnly: true,
                secure: false,//https thì true
                sameSite: 'strict' //chống XSS attack
            })
            return res.redirect('/wellcome')
        })(req, res, next)
    }

    checkAuthenFacebook(req, res, next) {
        passport.authenticate('facebook')(req,res)}
    
    responseFacebook(req, res, next) {
        passport.authenticate('facebook',(err, user)=>{ 
            if(err) { 
                return res.status(500).json('lỗi server k kết nối được DB') }
            if(!user) { return res.status(401).json('tài khoản hoặc mật khẩu không đúng') }

            let token = jwt.sign({_id: user._id}, secret, {expiresIn: '1m'})
            res.cookie('token',token ,{
                // httpOnly: true,
                secure: false,//https thì true
                sameSite: 'strict' //chống XSS attack
            })
            return res.redirect('/wellcome')
        })(req,res,next)
    }
  }
  module.exports = new loginMiddle
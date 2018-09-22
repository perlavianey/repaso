const passport = require('passport')
const User = require('../models/User')

passport.use(User.createStrategy()) //crea estrategia local porque usa passport local mongoose

passport.serializeUser((user,cb)=>{ //cb es callback
  cb(null,user)
})

passport.deserializeUser((user,cb)=>{
  cb(null,user)
})

module.exports=passport
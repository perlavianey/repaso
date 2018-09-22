const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  username:String,
  email:String,
  photoURL:String,
  notitas:[{
    type:Schema.Types.ObjectId,
    ref:'Notita'
  }]
},{
  timestamps:{
  createdAt:'created_at',
  updatedAt:'updated_at'
},
  versionKey:false  
})
module.exports = mongoose.model('User',userSchema.plugin(PLM,{usernameField:'email'})) //este modelo es para autenticar y por qué campo los va a autenticar, asì automaticamente email no va a permitir repetidos
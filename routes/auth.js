const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const uploadCloud = require('../helpers/cloudinary')

const isLogged = (req,res,next)=>{
  if(req.isAuthenticated()) next()
  else res.redirect('/login')
}

router.get('/signup',(req,res,next)=>{
  config = {
    title:"Sign up",
    btnValue:"Crear cuenta",
    url:'/signup',
    password:true,
    id:''
  }
  //res.send('Hola amigo')
  res.render('auth/signup',config) //no empieza con diagonal porque ya sabe que tiene que ir a routes
})

router.post('/signup',(req,res,next)=>{
  //User.register(con qué quieres que lo registre y con que passport)
  User.register(req.body,req.body.password) //req.body es lo que viene en el form
  .then(user=>{
    //res.send(user) //send lo muestra en pantalla
    res.redirect('/login')
  })
  .catch(e=>console.log(e))
})

router.get('/login',(req,res,next)=>{
  if(req.user) req.logOut() //antes de q entre a login que haga logout
  res.render('auth/login')
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{ //middleware busca al user (estrategia 'local'), si es facebook es 'facebook'
req.app.locals.loggedUser = req.user; //se creo variable loggedUser  
res.redirect('/profile')
})

router.get('/profile',isLogged,(req,res,next)=>{
  //res.send(req.user)
  User.findById(req.app.locals.loggedUser._id).populate('notitas')
  .then(usuario=>{
    console.log(usuario)
    res.render('profile',usuario) //lo que le tengo que pasar aquí es un objeto
  })
  .catch(e=>console.log(e))
})


router.get('/edit/:id',isLogged,(req,res,next)=>{
  //let {url} = req
  //let spliteado = url.split("/")
  //console.log(req.url)
  //console.log(spliteado)
  config = {
    title:'Edit profile',
    btnValue:'Save changes',
    url:"/edit",
    username:req.app.locals.loggedUser.username,
    email:req.app.locals.loggedUser.email,
    password:false,
    id:req.user._id
  }
  //res.render('edit')
  res.render('auth/signup',config)
}) //:variable lo que venga después del slash va a estar cambiando

router.post('/edit/:id',(req,res,next)=>{
  let {id} = req.params
  User.findByIdAndUpdate(id,req.body,{new:true}) //new te regresa el nuevo
  .then(user=>{
    req.app.locals.loggedUser=user
    res.redirect('/profile')
  }).catch(e=>next(e))
})

router.get('/edit_image', isLogged,(req,res,next)=>{
  res.render('edit_image')
})

router.post('/edit_image',isLogged, uploadCloud.single('photoURL'),(req,res,next)=>{
  User.findByIdAndUpdate(req.app.locals.loggedUser._id,{photoURL:req.file.url},{new:true})
  .then(user=>{
    req.app.locals.loggedUser=user
    console.log(user)
    res.redirect('/profile')
  })
  .catch(e=>next(e))
})

module.exports = router
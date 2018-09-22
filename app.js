require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport     =require('./helpers/passport')
const session      =require('express-session') //guarda una sesión en la BD
const MongoStore   =require('connect-mongo')(session) //guarda la sesión

mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x =>console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err =>console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
//Todo lo que vaya a poner, ponlo abajo de esta línea wey

app.use(session({
  secret:'secret', //para que se guarde la sesión
  resave:true,
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json()); //lo que venga del formulario se ponga como json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup 
app.use(require('node-sass-middleware')({ //sass motor de estilos
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views')); //para que acomplete la ruta absoluta y que vea en la carpeta views
app.set('view engine', 'hbs'); //el view engine será handlebars
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Repaso'; //Título por de las páginas por default

const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/',auth)

const notita = require('./routes/notita');
app.use('/',notita)

module.exports = app;
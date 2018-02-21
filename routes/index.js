var express = require('express');
var router = express.Router();
var User = require('../models/User.js')
var passport = require('passport');
var app = express();
var LocalStrategy = require('passport-local').Strategy;

// GET /register: Una página para registrar el usuario. Esta debería ser un formulario que tome email y contraseña.
// GET /login: Otra para el Login. También un formulario similar. (Podríamos usar la misma vista y cambiar las cosas claves mandando variables locales.)
// GET /public: Desps una vista que sea una página pública,
// GET /private: 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.VerifyPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', (req, res, next) => {
  res.render('registerForm.ejs')
})

router.post('/register', (req, res, next) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then((data) => res.redirect('/login'))
})

router.get('/login', (req, res, next) => {
  res.render('login.ejs')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private',
  failureRedirect: '/login'
}));

router.get('/public', (req, res, next) => {
  res.render('public.ejs')
})

router.get('/private', (req, res, next) => {
  res.render('private.ejs')
})


module.exports = router;

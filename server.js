if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const path = require('path')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

const users = []

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./public/js/passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use('/public', express.static('public'))
app.use('/', indexRouter)
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/login', checkNotAuthenticated, (req, res) => {res.render('login.ejs')})
app.post('/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get('/register', checkNotAuthenticated, (req, res) => {res.render('register.ejs')})
app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')        
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})
app.delete('/logout', checkAuthenticated, (req,res) =>{
    req.logOut()
    res.redirect('/login')
})
app.get('/profile/:id', (req, res) =>{
    var userdata = {id: req.body.id, name: req.body.name, email: users.email, password: users.password}
    res.render('profile',{userid: req.params.id,userdata: userdata})
})
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}
const mongoose = require('mongoose')
const { doesNotMatch } = require('assert')
const { error } = require('console')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

app.listen(process.env.PORT || 3000)
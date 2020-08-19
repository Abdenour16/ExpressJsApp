if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
// const & Var
const express = require('express')
const path = require('path')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
// Routes
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
//Set
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
//Used
app.use(expressLayouts);
app.use('/public', express.static('public'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)

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
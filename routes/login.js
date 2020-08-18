const express = require('express')
const router = express.Router()
const register = require('./register')
const users = register.users
// Passport
const passport = require('passport')
const initializePassport = require('../public/js/passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
// Page
router.get('/', (req, res) => {res.render('login')})
router.post('/',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router;
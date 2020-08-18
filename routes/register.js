const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const users = []

router.get('/', (req, res) => {res.render('register')})

router.post('/', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')        
    } catch{ res.redirect('/register') }
    console.log(users)
})

module.exports = router;
module.exports.users = users
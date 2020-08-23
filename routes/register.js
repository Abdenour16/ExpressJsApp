const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/register')
const users = []

router.get('/', (req, res) => {
    res.render('register',{ user: new User() })
})

router.post('/', async (req, res) => {
    if(req.body.password.length < 7){
        res.render('register', {
            errorMessage: 'the Password must be more then 8 caracters',
        })
    }else{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User ({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        users.push(user)
    try{
        const newUser = await new user.save()
        res.redirect(`login`)
    }
    catch{ res.render('register', {user: user,errorMessage: 'Error creating Account'}) }
    console.log(users)
}
})

module.exports = router
module.exports.users = users
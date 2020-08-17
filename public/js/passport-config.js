const bcrypt = require('bcrypt')
const LocalStategy = require('passport-local').Strategy

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null){
            return done(null, false, {message: 'No user with that Email'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else{
                return done(null, false, {message: 'Password Incorrect'})
            }
        }catch (e){
            return done(e)
        }

    }
    passport.use(new LocalStategy({ usernameField: 'email' },
authenticateUser))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
    done(null, getUserById(id))
})
}

module.exports = initialize
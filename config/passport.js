const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({
          attributes: ['id', 'name', 'email', 'password'],
          where: { email: username },
          raw: true
        })

        if (!user) return done(null, false, { message: '此信箱未註冊過' })

        const isMath = await bcrypt.compare(password, user.password)
        if (!isMath) return done(null, false, { message: '密碼錯誤' })

        return done(null, user)
      } catch (error) {
        error.errorMessage = '登入失敗'
        done(error)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['email', 'displayName']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const name = profile.displayName

        const user = await User.findOne({
          attributes: ['id', 'name', 'email'],
          where: { email },
          raw: true
        })

        if (user) return done(null, user)
        const randomPwd = Math.random().toString(36).slice(-8)
        const hash = await bcrypt.hash(randomPwd, 10)
        const newUser = await User.create({ name, email, password: hash })
        return done(null, {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        })
      } catch (error) {
        error.errorMessage = '登入失敗'
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})

module.exports = passport

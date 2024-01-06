const passport = require('passport')
const LocalStrategy = require('passport-local')
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

        done(null, user)
      } catch (error) {
        error.errorMessage = '登入失敗'
        done(error)
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

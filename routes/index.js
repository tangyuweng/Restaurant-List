const express = require('express')
const router = express.Router()
const passport = require('passport')

const oauth = require('./oauth')
const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/oauth', oauth)
router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.get('/register', (req, res) => {
  res.render('register', { noBody: true })
})

router.get('/login', (req, res) => {
  res.render('login', { noBody: true })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash: true
  })
)

router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) next(error)
    req.flash('success', '登出成功')
    return res.redirect('/login')
  })
})

module.exports = router

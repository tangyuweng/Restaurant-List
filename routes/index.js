const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const users = require('./users')

router.use('/restaurants', restaurants)
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

router.post('/login', (req, res) => {
  res.send(req.body)
})

module.exports = router

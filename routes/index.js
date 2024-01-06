const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.get('/register', (req, res) => {
  res.render('register', { noBody: true })
})

router.get('/login', (req, res) => {
  res.render('login', { noBody: true })
})

router.post('/register', (req, res) => {
  const body = req.body
  res.send(
    `name: ${body.name}, email: ${body.email}, password: ${body.password}, confirmPwd: ${body.confirmPwd}`
  )
})

router.post('/login', (req, res) => {
  res.send(req.body)
})

module.exports = router

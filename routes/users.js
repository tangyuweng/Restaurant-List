const express = require('express')
const router = express()
const { validationResult } = require('express-validator')
const registrationValidationRules = require('../middlewares/registrationValidationRules')
const toErrorObject = require('../middlewares/toErrorObject')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

router.post('/', registrationValidationRules, async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const errorObject = toErrorObject(errors)
      req.flash('register_error', errorObject)
      return res.redirect('back')
    }

    const count = await User.count({ where: { email } })
    if (count > 0) {
      req.flash('error', '此信箱已註冊過')
      return res.redirect('back')
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash })
    if (!user) return res.redirect('back')

    req.flash('success', '註冊成功')
    res.redirect('/login')
  } catch (error) {
    error.errorMessage = '註冊失敗'
    next(error)
  }
})

module.exports = router

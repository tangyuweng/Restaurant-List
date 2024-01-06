const express = require('express')
const router = express()
const { validationResult } = require('express-validator')
const registrationValidationRules = require('../middlewares/registrationValidationRules')
const toErrorObject = require('../middlewares/toErrorObject')

const db = require('../models')
const User = db.User

router.post('/', registrationValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorObject = toErrorObject(errors)
      // console.log(errorObject)
      req.flash('register_error', errorObject)
      return res.redirect('back')
    }
  } catch (error) {
    error.errorMessage = '註冊失敗'
    next(error)
  }
})

module.exports = router

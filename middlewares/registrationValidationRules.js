const { check } = require('express-validator')

const registrationValidationRules = [
  check('name')
    .trim()
    .isLength({ max: 20 })
    .withMessage('使用者名稱最多20個字'),
  check('email').trim().isEmail().withMessage('請輸入有效的電子信箱'),
  check('password')
    .notEmpty()
    .withMessage('請輸入密碼')
    .isLength({ min: 8, max: 20 })
    .withMessage('密碼長度應介於8到20之間'),
  check('confirmPwd')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與確認密碼不相符')
      }
      return true
    })
    .withMessage('密碼與確認密碼不相符')
]

module.exports = registrationValidationRules

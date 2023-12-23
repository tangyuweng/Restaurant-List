const { check } = require('express-validator')

const validCategories = [
  '中式料理',
  '日式料理',
  '美式',
  '義式餐廳',
  '中東餐廳',
  '酒吧',
  '咖啡'
]

const restaurantValidationRules = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('請輸入餐廳名稱')
    .isLength({ max: 40 })
    .withMessage('餐廳名稱最多40個字'),

  check('name_en')
    .trim()
    .isLength({ max: 60 })
    .withMessage('餐廳名稱(英文)最多60個字'),

  check('category')
    .trim()
    .notEmpty()
    .withMessage('請選擇餐廳種類')
    .isIn(validCategories)
    .withMessage('請選擇有效餐廳種類'),

  check('image')
    .trim()
    .notEmpty()
    .withMessage('請輸入餐廳照片網址')
    .isURL()
    .withMessage('請輸入有效的URL'),

  check('location')
    .trim()
    .notEmpty()
    .withMessage('請輸入餐廳地址')
    .isLength({ max: 100 })
    .withMessage('餐廳地址最多100個字'),

  check('phone')
    .trim()
    .notEmpty()
    .withMessage('請輸入餐廳電話')
    .matches(/^\d{2} \d{4} \d{4}$/)
    .withMessage('請輸入有效的電話號碼 (例如: 02 2323 4545)'),

  check('google_map')
    .trim()
    .notEmpty()
    .withMessage('請輸入Google Map網址')
    .isURL()
    .withMessage('請輸入有效的URL'),

  check('rating')
    .notEmpty()
    .withMessage('請輸入評分')
    .isFloat({ min: 0.1, max: 5.0 })
    .withMessage('請輸入有效的評分（0.1 ~ 5.0）'),

  check('description')
    .trim()
    .isLength({ max: 200 })
    .withMessage('餐廳介紹最多200字')
]

module.exports = restaurantValidationRules

const express = require('express')
const router = express.Router()
const restaurantValidationRules = require('../middlewares/restaurantValidationRules')
const { validationResult } = require('express-validator')

const db = require('../models')
const Restaurant = db.Restaurant

// 瀏覽全部所有餐廳，收尋 排序 分頁
router.get('/', async (req, res, next) => {
  try {
    const keyword = req.query.search?.trim()
    let whereCondition = {}
    if (keyword) {
      whereCondition = {
        [db.Sequelize.Op.or]: [
          {
            name: {
              [db.Sequelize.Op.like]: `%${keyword}%`
            }
          },
          {
            category: {
              [db.Sequelize.Op.like]: `%${keyword}%`
            }
          }
        ]
      }
    }

    const selectedSort = req.query.sort
    let orderCondition = []
    if (selectedSort) {
      switch (selectedSort) {
        case '1':
          orderCondition = [['name', 'ASC']]
          break
        case '2':
          orderCondition = [['name', 'DESC']]
          break
        case '3':
          orderCondition = [['category', 'ASC']]
          break
        case '4':
          orderCondition = [['location', 'ASC']]
          break
        case '5':
          orderCondition = [['rating', 'DESC']]
          break
        default:
          break
      }
    }

    const page = parseInt(req.query.page) || 1
    const limit = 9
    const { count, rows: restaurants } = await Restaurant.findAndCountAll({
      attributes: ['id', 'name', 'image', 'category', 'rating', 'location'],
      where: whereCondition,
      order: orderCondition,
      offset: (page - 1) * limit,
      limit: limit,
      raw: true
    })

    const totalPages = Math.ceil(count / limit)
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    const prevDisabled = page === 1
    const nextDisabled = page === totalPages

    res.render('index', {
      restaurants,
      keyword,
      selectedSort,
      pages,
      prevPage: page > 1 ? page - 1 : page,
      nextPage: page + 1,
      prevDisabled,
      nextDisabled
    })
  } catch (error) {
    error.errorMessage = '資料取得失敗'
    next(error)
  }
})

// 新增餐廳頁面
router.get('/new', (req, res) => {
  // 取得之前保存的填寫資料
  const formData = req.session.formData || {}
  // 清除 session 中的 formData
  delete req.session.formData
  res.render('new', { formData })
})

// 新增餐廳
router.post('/', restaurantValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // 保留填寫資料到 session
      req.session.formData = req.body
      // 將驗證錯誤訊息轉為 key-value pair
      const errorObject = {}
      errors.array().forEach((error) => {
        errorObject[error.path] = error.msg
      })
      req.flash('validation_error', errorObject)
      return res.redirect('back')
    }

    await Restaurant.create(req.body)
    // 清除 session 中的 formData
    delete req.session.formData
    req.flash('success', '新增成功')
    res.redirect('/restaurants')
  } catch (error) {
    error.errorMessage = '新增失敗'
    next(error)
  }
})

// 瀏覽指定餐廳
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const restaurant = await Restaurant.findByPk(id, {
      attributes: [
        'name',
        'name_en',
        'category',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description'
      ],
      raw: true
    })
    res.render('show', { restaurant })
  } catch (error) {
    error.errorMessage = '資料取得失敗'
    next(error)
  }
})

// 編輯餐廳頁
router.get('/:id/edit', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const restaurant = await Restaurant.findByPk(id, {
      attributes: [
        'id',
        'name',
        'name_en',
        'category',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description'
      ],
      raw: true
    })
    res.render('edit', { restaurant })
  } catch (error) {
    error.errorMessage = '資料取得失敗'
    next(error)
  }
})

// 更新餐廳
router.put('/:id', restaurantValidationRules, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorObject = {}
      errors.array().forEach((error) => {
        errorObject[error.path] = error.msg
      })
      req.flash('validation_error', errorObject)
      res.redirect('back')
    }

    await Restaurant.update(req.body, { where: { id } })
    req.flash('success', '更新成功')
    res.redirect(`/restaurants/${id}`)
  } catch (error) {
    error.errorMessage = '更新失敗'
    next(error)
  }
})

// 刪除餐廳
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    await Restaurant.destroy({ where: { id } })
    req.flash('success', '刪除成功')
    res.redirect('/restaurants')
  } catch (error) {
    error.errorMessage = '刪除失敗'
    next(error)
  }
})

module.exports = router

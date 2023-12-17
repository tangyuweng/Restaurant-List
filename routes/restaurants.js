const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

// 瀏覽全部所有餐廳，收尋餐廳
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

    const restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating', 'location'],
      where: whereCondition,
      order: orderCondition,
      raw: true
    })
    res.render('index', { restaurants, keyword, selectedSort })
  } catch (error) {
    error.errorMessage = '資料取得失敗'
    next(error)
  }
})

// 新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
router.post('/', async (req, res, next) => {
  try {
    await Restaurant.create(req.body)
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
    const id = req.params.id // id = string
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
    const id = req.params.id
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
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    await Restaurant.update(req.body, { where: { id: id } })
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
    const id = req.params.id
    await Restaurant.destroy({ where: { id } })
    req.flash('success', '刪除成功')
    res.redirect('/restaurants')
  } catch (error) {
    error.errorMessage = '刪除失敗'
    next(error)
  }
})

module.exports = router

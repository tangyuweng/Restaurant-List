const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

// 瀏覽全部所有餐廳，收尋餐廳
router.get('/', async (req, res) => {
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
    const restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      where: whereCondition,
      raw: true
    })
    res.render('index', { restaurants, keyword })
  } catch (err) {
    console.log(err)
  }
})

router.get('/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
router.post('/', async (req, res) => {
  try {
    await Restaurant.create(req.body)
    res.redirect('/restaurants')
  } catch (err) {
    console.log(err)
  }
})

// 瀏覽指定餐廳
router.get('/:id', async (req, res) => {
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
  } catch (err) {
    console.log(err)
  }
})

// 編輯餐廳頁
router.get('/:id/edit', async (req, res) => {
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
  } catch (err) {
    console.log(err)
  }
})

// 更新餐廳
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Restaurant.update(req.body, { where: { id: id } })
    res.redirect(`/restaurants/${id}`)
  } catch (err) {
    console.log(err)
  }
})

// 刪除餐廳
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Restaurant.destroy({ where: { id } })
    res.redirect('/restaurants')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router

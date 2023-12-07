const express = require('express')
const { engine } = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const port = 3000
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

// 瀏覽全部所有餐廳，收尋餐廳
app.get('/restaurants', async (req, res) => {
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

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
app.post('/restaurant', async (req, res) => {
  try {
    await Restaurant.create(req.body)
    res.redirect('/restaurants')
  } catch (err) {
    console.log(err)
  }
})

// 瀏覽指定餐廳
app.get('/restaurants/:id', async (req, res) => {
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
app.get('/restaurants/:id/edit', async (req, res) => {
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
app.put('/restaurants/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Restaurant.update(req.body, { where: { id: id } })
    res.redirect(`/restaurants/${id}`)
  } catch (err) {
    console.log(err)
  }
})

// 刪除餐廳
app.delete('/restaurants/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Restaurant.destroy({ where: { id } })
    res.redirect('/restaurants')
  } catch (err) {
    console.log(err)
  }
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

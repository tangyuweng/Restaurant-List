const express = require('express')
const { engine } = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

// 瀏覽全部所有餐廳，收尋餐廳
app.get('/restaurants', (req, res) => {
  const keyword = req.query.search?.trim()
  if (keyword) {
    const whereCondition = {
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
    return Restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      where: whereCondition,
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants, keyword }))
      .catch((err) => console.log(err))
  } else {
    return Restaurant.findAll({
      attributes: ['id', 'name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((err) => console.log(err))
  }
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
app.post('/restaurant', (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  } = req.body

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })
    .then(() => res.redirect('/restaurants'))
    .catch((err) => console.log(err))
})

// 瀏覽指定餐廳
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id // id = string
  return Restaurant.findByPk(id, {
    attributes: [
      'name',
      'category',
      'location',
      'google_map',
      'phone',
      'description',
      'image'
    ],
    raw: true
  })
    .then((restaurant) => res.render('show', { restaurant }))
    .catch((err) => console.log(err))
})

// 編輯指定餐廳頁
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
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
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((err) => console.log(err))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

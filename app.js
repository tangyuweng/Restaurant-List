const express = require('express')
const { engine } = require('express-handlebars')
const db = require('./models')

const app = express()
const port = 3000
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

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
      attributes: ['name', 'image', 'category', 'rating'],
      where: whereCondition,
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants, keyword }))
      .catch((err) => console.log(err))
  } else {
    return Restaurant.findAll({
      attributes: ['name', 'image', 'category', 'rating'],
      raw: true
    })
      .then((restaurants) => res.render('index', { restaurants }))
      .catch((err) => console.log(err))
  }
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id // id = string
  const foundRestaurant = restaurants.find(
    (restaurant) => restaurant.id.toString() === id
  )
  res.render('show', { foundRestaurant })
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

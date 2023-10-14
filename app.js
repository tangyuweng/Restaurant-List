const express = require('express');
const { engine } = require('express-handlebars');
const restaurants = require('./public/jsons/restaurant.json').results;

const app = express();
const port = 3000;

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/restaurants');
});

app.get('/restaurants', (req, res) => {
  res.render('index', { restaurants: restaurants });
});

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id; // id = string
  const foundRestaurant = restaurants.find(
    (restaurant) => restaurant.id.toString() === id
  );
  res.render('show', { foundRestaurant });
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

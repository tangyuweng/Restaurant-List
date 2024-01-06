const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('dotenv').config()
const router = require('./routes')
const passport = require('./config/passport')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

const app = express()
const port = 3000

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      isEqual: (value1, value2) => {
        return value1 === value2
      }
    }
  })
)
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(flash())

app.use(passport.initialize())

app.use(passport.session())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

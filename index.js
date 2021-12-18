const express = require('express')
const mustacheExpress = require('mustache-express')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, `views`))
app.set('view engine', 'mustache')
app.engine('mustache', mustacheExpress())

app.use(express.urlencoded({ extended: true }))

let time = '18:00'
let remaining = ''

app.use((req, res) => {
    if (req.body.time) time = req.body.time
    res.render('index', { time, remaining: '-' })
})

app.listen(80)

setInterval(() => {
    const now = new Date()
    const nowHour = now.getHours()
    const nowMinute = now.getMinutes()
    const nowSeconds = now.getSeconds()

    const [endHour, endMinute] = time.split(':')
    const diffHour = Number(endHour) - nowHour
    
}, 1000)
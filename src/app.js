const request = require('request')
const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const publicPath = path.join(__dirname, '../public')


app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

// for static directory
app.use(express.static(publicPath))


//***************************************************************

// pages
app.get('', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

//************************************************************************************************* */

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "no address provided"
        })
    }
    
    let address = req.query.address
    const geourl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1Ijoic2FnYXJwYXVsMDA3IiwiYSI6ImNrdGgxdWxlazA0Z2Myb2p3bmpseGM0ZHoifQ.Odjyy6JBsEwu1PaF9jkIVg`
    
    request({url: geourl, json: true}, (error, {body}) => {
        if (error) {
            return res.send({
                error: "unable to connect to location service"
            })
        } else if (body.features.length === 0) {
            {
                return res.send({
                    error: "unable to find location, try another search"
                })
            }
        }

        let coords = body.features[0].center
        let place = body.features[0].place_name
        let lat = coords[1]
        let lon = coords[0]

        const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=2e61246cf2c95899a87f0b2ae4ccd179`

        request({url: weatherurl,json: true}, (error, {body}) => {
            if (error) {
                return res.send('Unable to connect to weather service!')
            } else if (body.error) {
                return res.send('Unable to find location')
            }

            let {description, icon} = body.weather[0]
            let {temp, humidity} = body.main
               let x = 0

            res.send({
                place,
                description,
                icon,
                temp,
                humidity
            })
        })

    })
})

//**************************************************************************************************************** */

// 404 error
app.get('*', (req, res) => {
    res.render('error')
})

// port
app.listen(3000, () => {
    console.log("Running...")
})
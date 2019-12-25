'use strict';
//DOTENV read our envieronment variables 
require('dotenv').config();
//express server
//express does all the headers (envelope stuff)
const express = require('express');
//who can touch our server 
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
//home route http://localhost:3000

server.get('/location', locationHandler);
server.get('/weather', weatherHandler);

// server.get('/weather', weatherHandler);
//server.use('*', notFoundHandler);
//server.use(errorHandler);

function locationHandler(request, response) {
    let city = request.query.city;//the name city is from the query link 
    //http://localhost:3000/location?city=amman
    console.log(city);
    getLocation(city)
        .then(locationData => {
            console.log(locationData);
            response.status(200).json(locationData);
        });
}
function getLocation(city) {
    // const url = `https://maps.google.com/maps/api/geocode/json?address=${city}&key=${process.env.GOOGLE_GEOCODE_API}`
    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API}&city=${city}&format=json`;
    return superagent.get(url)
        .then(data => {
            return new Location(city, data.body);
        });
}
function Location(city, data) {
    this.search_query = city;
    this.display_names = data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
}
// function weatherHandlerTester(request,response) {
//     //http://localhost:3000/weather
//     let weatherData = require('./data/darksky.json');
//     let weather = weatherData.daily.data;
//     let result = weather.map(day => {
//         return new Weather(day);
//     });
//     response.status(200).json(result);
// }
function weatherHandler(request, response) {
    let city = request.query;//will read the req query
    // console.log('the query is' , city);
    let lat = request.query.latitude;
    let lon = request.query.longitude;
    // console.log('lat is ' ,lat);
    // console.log('lon is ', lon);
    //http://localhost:3000/weather?search_query=amman&latitude=31.9515694&longitude=35.9239625
    //http://localhost:3000/weather?
    // let lat = request.query;
    // let lon = request.query;
    // console.log('lat is ',lat);
    // console.log('lon is',lon);
    getWeather(lat,lon)
        .then(weatherData => {
            response.status(200).json(weatherData);
        });
}
function getWeather(lat,lon) {
    const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lon}`;
    return superagent.get(url)
        .then(data => {
            let weather = data.body;
            // console.log(weather);
            return weather.daily.data.map(day => {
                // console.log(day);
                return new Weather(day);
            });
        });
}
function Weather(day) {
    this.forecast = day.summary;
    this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
server.get('/', (request, response) => {
    response.status(200).send('you did it man');
});

server.get('/any', (request, response) => {
    throw new Error('any page nothing is her');
});

server.use('*', (request, response) => {
    response.status(404).send('Sorry, something went wrong');
});

server.use((error, request, response) => {
    response.status(500).send(error);
});
server.listen(PORT, () => {
    console.log('server is listening on ', PORT);
});
'use strict';
//DOTENV read our envieronment variables 

//express server
//express does all the headers (envelope stuff)
const express = require('express');
const server = express();

//who can touch our server 
const cors = require('cors');
const superagent = require('superagent');

server.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;
//home route http://localhost:3000

server.get('/location', locationHandler);
// server.get('/weather', weatherHandler);
//server.use('*', notFoundHandler);
//server.use(errorHandler);

function locationHandler(request, response) {
    let city = request.query.city;
    getLocation(city)
        .then(locationData => {
            console.log(locationData);
            response.status(200).json(locationData);
        });
}
function getLocation(city) {
    //let data = require('./data/geo.json');
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

function weatherHandler(request, response) {
    getWeather(request.query.data)
        .then(weatherData => {
            response.status(200).json(weatherData);
        });
}
function getWeather(query) {
    //console.log(query);
    const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${query.latitude},${query.longitude}`;
    console.log(url);
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
    response.status(404).send('not found');
});

server.use((error, request, response) => {
    response.status(500).send(error);
});
server.listen(PORT, () => {
    console.log('server is listening on ', PORT);
});
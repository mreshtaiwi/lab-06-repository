'use strict';
//DOTENV read our envieronment variables 
require('dotenv').config();
//express server
//express does all the headers (envelope stuff)
const express = require('express');
//who can touch our server 
const cors = require('cors');

const PORT = process.env.PORT;

const server = express();
server.use(cors());
//home route http://localhost:3000

server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
//server.use('*', notFoundHandler);
//server.use(errorHandler);

/*
object should look like this 
    {
        "search_query": "seattle",
        "formatted_query": "Seattle, WA, USA",
        "latitude": "47.606210",
        "longitude": "-122.332071"
    }
*/

function locationHandler(request, response) {

    let locationData = getLocation(request.query.data);
    response.status(200).json(locationData);
}
function getLocation(city){
    let data = require('./data/geo.json');
    return new Location(city, data);
    response.status(200).json(locationData);
}
let locations = [];
function Location(city, data) {
    this.search_query = city;
    this.display_names = data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
    locations.push(this);
}

function weatherHandler(request, response) {
    try {
        const darkskyData = require('./data/darksky.json');
        const weatherSummaries = [];
        darkskyData.daily.data.forEach( day => {
            weatherSummaries.push(new Weather(day));
        });
        response.status(200).json(weatherSummaries);
    }
    catch (error) {
        errorHandler('So sorry, something went wrong.', request, response);
    }
}
function Weather(day) {
    this.forecast = day.summary;
    this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
server.get('/', (request, response) => {
    response.status(200).send('you did it man');
});
function errorHandler(error, request, response) {
    console.log('ERROR', error);
    response.status(500).send(error);
}
// server.get('/location', (request, response) => {
//     const locationData = require('./data/geo.json');
//     const location = new Location(locationData);
//     response.status(200).json(location);
// });

/*
[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
  ...
]
*/

// let weatherarray = [];
// server.get('/weather', (request, response) => {
//     const weatherData = require('./data/darksky.json');
//     // let forcast = [];
//     // let timer = [];
//     weatherData.daily.data.forEach((element, idx) => {
//         const weather = new Weather(weatherData[idx]);
//         console.log('this is ', weather);
//     });

// for (let i = 0; i < weatherData.daily.data.length; i++) {
//     const weather = new Weather(weatherData);
//     // forcast[i] = weatherarray[0].summary[0].summary;   
//     // timer[i] = weatherarray[0].data[i].time;
// }
// response.status(200).json(weatherarray[0]);
//console.log(forcast);
// weatherData.daily.data.forEach( (value,idx) => {
//     weatherarray[idx] = new Weather(weatherData);
//     console.log(weatherarray[idx]);
// });
// response.status(200).json(weatherarray);
//console.log('this is weather',weatherarray);
// });

// function Weather(data) {
//     // this.search_query = 'Lynnwood';
//     this.summary = data.daily.data;
//     this.time = data.daily.data.time;
//     weatherarray.push(this);
// }


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
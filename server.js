var express = require('express')
var app = express()
var bodyParser=require('body-parser')
var jasmine = require('jasmine');
var it = require('it');
var describe = require("describe")
var OpenWeatherMapHelper = require("openweathermap-node");
var request = require("request");
var mongo = require('mongodb');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.json());
var weather_response=[];;
var weather_info_obj;
var weather_info=[];
var myresponse;
var myresponse1;
var response5;
var response2=[];
var response3=[];
var final_obj={};
var database_query;
var a=0;
var final_array_obj=[];
var k;
var cityLoc=[];
app.listen(8080);

const helper = new OpenWeatherMapHelper(         //client for open weather api
    {
        APPID: 'aa84a4364c8471fbcf6e5577f294f530',
        units: "metric"
    }
);

app.get('/',function(request, response)
{
  response.render("index")});


app.post('/', function (request, res) {
    console.log(request.body.start,request.body.end);
        res.writeHead(200,{'content-type':'application/json'})
        cityLoc.length=0;
        var start = request.body.start;
        var end = request.body.end;
        var googleMapsClient = require('@google/maps').createClient({key: 'AIzaSyAFBqP-xdCwIi2erYvEEUVIHdCNPfzZk8Y'});
        googleMapsClient.directions({origin:request.body.start,destination:request.body.end,}, function(err, response) {
            if (err) throw err;
            var weather_of_cities=[];
            var latitude=[];
            var longitude=[];
            myresponse ={"map_response":response.json}
            console.log("mkbhd");
            console.log(myresponse);
            cityLoc.push({latitude:response.json.routes[0].legs[0].start_location.lat,longitude:response.json.routes[0].legs[0].end_location.lng})
            for (var i = 0; i < response.json.routes[0].legs[0].steps.length; i++) {
              weather_of_cities[i] =response.json.routes[0].legs[0].steps[i].start_location;
              cityLoc.push({latitude:weather_of_cities[i].lat, longitude:weather_of_cities[i].lng });}
              getWeather();

              function getWeather(){
                  response2.length=0;
                  for( t=0;t<cityLoc.length;t++){
                    var done = false;
                    var data;
                     helper.getCurrentWeatherByGeoCoordinates(cityLoc[t].latitude, cityLoc[t].longitude, function(err,responsewe,body) {
                          response2.push(responsewe)
                          console.log("i am in weather");
                          console.log(response2.length);
                          if(response2.length==response.json.routes[0].legs[0].steps.length){
                            final_obj={"weather_response":response2}
                            myresponse1=Object.assign(myresponse, final_obj);
                            console.log(response2.length);
                            res.end(JSON.stringify(myresponse1))
                          }
                      });
                    }
                return
              }

            });

        });

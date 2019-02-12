const express = require('express')
const app = express()
const bodyParser=require('body-parser')
//const request = require('request');

const jasmine = require('jasmine');
const it = require('it');
const describe = require("describe")
const OpenWeatherMapHelper = require("openweathermap-node");
const request = require("request");
const deasync = require("deasync")
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
var a=true;
var final_array_obj=[];
app.listen(3000);
var k;
var cityLoc=[];




var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/route_weather";

MongoClient.connect(url, function(err, db) {
if (err) throw err;
var dbo = db.db("route_weather");    //creating database nmaed route weather
dbo.createCollection("Response_Object", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    console.log("Database created!");
});




const helper = new OpenWeatherMapHelper(         //client for open weather api
    {
        APPID: 'aa84a4364c8471fbcf6e5577f294f530',
        units: "metric"
    }
);



app.get('/', function (request, response) {
  response.render('index');
})


app.post('/', function (request, res) {
  console.log(request.body.start,request.body.end);
  //console.log(request.IncomingMessage.body.start);

  var query = {start:request.body.start,end:request.body.end};
  console.log(query);


  dbo.collection("Response_Object").find(query).toArray(function(err, result) {
    if (err) throw err;
    database_query=result[0];
    a=a+1;
    console.log(a);
    console.log(database_query);
  });

if(a==1){
  if(database_query)  // if the start and end locations are not present in database
   {
  console.log("I am in else");
  res.writeHead(200,{'content-type':'application/json'})

  var start = request.body.start;
  var end = request.body.end;


//console.log(start);
//console.log(end);
var googleMapsClient = require('@google/maps').createClient({      //client for google map api
  key: 'AIzaSyAFBqP-xdCwIi2erYvEEUVIHdCNPfzZk8Y'
});

googleMapsClient.directions({
  origin:start,
  destination:end,
}, function(err, response) {
  if (!err) {
    //console.log(response.json);
    var weather_of_cities=[];

    var latitude=[];
    var longitude=[];

    myresponse ={"map_response":response.json,}

      console.log(myresponse);
    for (var i = 0; i < response.json.routes[0].legs[0].steps.length; i++) {
       weather_of_cities[i] =response.json.routes[0].legs[0].steps[i].start_location;
      //console.log(response.json.routes[0].legs[0].steps[i].start_location);
      cityLoc.push({latitude:weather_of_cities[i].lat, longitude:weather_of_cities[i].lng });

}

async function getWeather(){
    for( t=0;t<cityLoc.length;t++){
      var done = false;
      var data;
       helper.getCurrentWeatherByGeoCoordinates(cityLoc[t].latitude, cityLoc[t].longitude, function(err, response,body) {
          data = response;
          done = true;
        });
        deasync.loopWhile(function(){return !done;});
        response2.push(data)
      }
  return
}


getWeather();


if(response2.length==response.json.routes[0].legs[0].steps.length)   // if weather api is called for all the steps
{
  //console.log(response2);
  final_obj={"weather_response":response2}
  myresponse1=Object.assign(myresponse, final_obj);
  console.log("sending json response");
  dbo.collection("Response_Object").insertOne({ start: request.body.start , end: request.body.end , Dbresponse:myresponse1}, function(err, res) {
   if (err) throw err;
   console.log("hola");
   console.log(res.ops);
})
a=0;
 res.end(JSON.stringify(myresponse1));
}
}
});

}
else // if the start and end locations are  present in database
{
  console.log("I am in if");
  myresponse1=database_query.Dbresponse
  res.writeHead(200,{'content-type':'application/json'})

  db.close()
  a=0;
  res.end(JSON.stringify(myresponse1));
}
}

});

});

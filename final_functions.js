var newArray=[];
var newArray2=[];
var newArray3=[];
var map;
var marker;
var markers = [];
var polyline1;

function initMap() {
  document.getElementById("button").addEventListener("click", function(){ submitForm();});
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
   map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 42.8864, lng: -78.8784}
  });
  directionsDisplay.setMap(map)

var input1 = document.getElementById('start');
  var options = {
    types: ['geocode']
  };
autocomplete = new google.maps.places.Autocomplete(input1, options);
autocomplete.bindTo('bounds', map);
autocomplete.setOptions({strictBounds: true})

var input2 = document.getElementById('end');
var options = {
  types: ['geocode']
};
autocomplete = new google.maps.places.Autocomplete(input2, options);
autocomplete.bindTo('bounds', map);
autocomplete.setOptions({strictBounds: true})




function submitForm()
{

  clearMarkers();

  // Using the core $.ajax() method
$.ajax({




    // The URL for the request
    url: "/",
    // The data to send (will be converted to a query string)
    data: {
        start:document.getElementById('start').value,
        end:document.getElementById('end').value,
    },

    // Whether this is a POST or GET request
    type: "POST",

    // The type of data we expect back
    dataType : "json",

})
  // Code to run if the request succeeds (is done);
  // The response is passed to the function
  .done(function(json) {

      console.log(json);
      var path = google.maps.geometry.encoding.decodePath(json.map_response.routes[0].overview_polyline.points);
      getCoordinates(path);

      var path1=google.maps.geometry.encoding.decodePath(json.map_response.geocoded_waypoints[0].place_id);
      getCoordinates1(path1);

       polyline = new google.maps.Polyline({
        path: path,
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#000000',
        fillOpacity: 0.35,
        map: map
    });

    polyline1=polyline;
    polyline1.setMap(map);

    for (var i = 0; i < json.map_response.routes[0].legs[0].steps.length; i++) {
    var mark = json.map_response.routes[0].legs[0].steps[i].start_location
    var title_lat=json.weather_response[i].coord.lat
    var title_lon=json.weather_response[i].coord.lon
    var title_humidity=json.weather_response[i].main.humidity
    var title_pressure=json.weather_response[i].main.pressure
    var title_max_temp=String(Math.floor(json.weather_response[i].main.temp_max-273.15).toFixed(2))
    var title_min_temp=String(Math.floor(json.weather_response[i].main.temp_min-273.15).toFixed(2))
    var current_temp=String(Math.floor(json.weather_response[i].main.temp-273.15).toFixed(2))
    var weather=json.weather_response[i].weather[0].description
    var bounds = asBounds(json.map_response.routes[0].bounds)


       marker = new google.maps.Marker({
        position: mark,
        map: map,
        title:"latitude:  "+ title_lat +", longitude:  "+title_lon+"\n Current Temp:  "+current_temp+"\n Min Temp:  "+title_min_temp+",  Max Temp:  "+title_max_temp+"\n  Humidity:  "+title_humidity+"\n  Weather:  "+weather,
      });
      markers.push(marker);
      marker.setMap(map);
    }
    map.fitBounds(bounds);



});

polyline1.setMap(null);

function getCoordinates(path) {
  var currentRoute = path; //Returns a simplified version of all the coordinates on the path
  var latArray1 = new Array();
  var lngArray1 = new Array();
  for (var x = 0; x < currentRoute.length; x++)
  {
    newArray2.push({lat: currentRoute[x].lat(), long:currentRoute[x].lng()});
  }

}
function getCoordinates1(path) {
  var currentRoute = path; //Returns a simplified version of all the coordinates on the path
  var latArray1 = new Array();
  var lngArray1 = new Array();
  for (var x = 0; x < currentRoute.length; x++)
  {
    newArray3.push({lat: currentRoute[x].lat(), long:currentRoute[x].lng()});

  }
}
}

function clearMarkers(){
    for(i=0;i<markers.length;i++)
    {
      markers[i].setMap(null);
    }
    markers=[];
  }
function asBounds(boundsObject){
    return new google.maps.LatLngBounds(asLatLng(boundsObject.southwest),asLatLng(boundsObject.northeast));}

function asLatLng(latLngObject){
return new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
}
}


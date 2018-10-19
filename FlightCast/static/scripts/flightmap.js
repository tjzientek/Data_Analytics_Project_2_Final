var startLat = 0;
var startLng = 0;
var endLat = 0;
var endLng = 0;

var latlngs = obj.map(function(elem) {
  if (elem.type == "Origin Airport") { 
    startLat = elem.latitude;
    startLng = elem.longitude;
  }
  if (elem.type == "Destination Airport") {
    endLat = elem.latitude;
    endLng = elem.longitude;
  }
  return [
      elem.latitude,
      elem.longitude
  ];
});

var centerLat = ((startLat - endLat) / 2) + startLat;
var centerLng = ((startLng - endLat) / 2) + startLng;

var myMap = L.map("map", {
  center: [39.8333333,-98.585522], // [centerLat, centerLng],
  zoom: 5
}), routeLines = [
  L.polyline(latlngs)
],
markers = [];

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 5,
  minZoom: 5,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var polyline = L.polyline(latlngs, {color: 'blue', dashArray: 8}).addTo(myMap);

var myIcon = L.icon({
  iconUrl: '/static/images/plane.png'
});

$.each(routeLines, function(i, routeLine) {
  var marker = L.animatedMarker(routeLine.getLatLngs(), {
    //icon: myIcon,
    autoStart: true,
    distance: 10000,  // meters
    interval: 200, // milliseconds
    onEnd: function() {
      // $(this._shadow).fadeOut();
      // $(this._icon).fadeOut(3000, function(){
      //   map.removeLayer(this);
      // });
    }
  });

  myMap.addLayer(marker);
  markers.push(marker);
});

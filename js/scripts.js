var mapElement = $('#map');
var dataSources = $('#datasource');

dataSources.on('change', function(){
  switch(parseInt(this.value)) {
    case 0:
      selectLandslide();
      break;
  }
});

initialize();

function selectLandslide(){
  var json_landslides = JSON.parse(httpGet("https://data.nasa.gov/resource/tfkf-kniw.json"));
  var locationElement = $('#location');
  locationElement.show();
  var infoElement = $('#info');
  for(var i=0; i<5; i++) {
    var loc = json_landslides[i].adminname1;
    locationElement.append("<option value='" + i + "'>" + loc + "</option>");
  }

  locationElement.on('change', function(){
    var selectedLandslide = json_landslides[this.value];
    infoElement.text("Country: " + selectedLandslide.countryname + ", date: "+ selectedLandslide.date );
    var bbox = getBBox(parseFloat(selectedLandslide.latitude), parseFloat(selectedLandslide.longitude), 100000);
    var url = 'http://www.openstreetmap.org/export/embed.html?bbox=' + bbox[0] + '%2C' + bbox[1] + '%2C' + bbox[2] + '%2C' + bbox[3] +  '&amp;layer=mapnik&amp;marker=' + selectedLandslide.latitude + '%2C' + selectedLandslide.longitude;
    mapElement.attr('src', url);
  });
}

function initialize(){
  $('#datasource').val(-1);
}

function httpGet(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function getCoordOffset(what, lat, lon, offset) {
  earthRadius = 6378137;
  coord = [lat, lon];

  radOff = what === 0 ? offset / earthRadius : offset / (earthRadius * Math.cos(Math.PI * coord[0] / 180));
  return coord[what] + radOff * 180 / Math.PI;
}

function getBBox(lat, lon, area) {
  offset = area / 2;
  return [
    getCoordOffset(1, lat, lon, -offset),
    getCoordOffset(0, lat, lon, -offset),
    getCoordOffset(1, lat, lon, offset),
    getCoordOffset(0, lat, lon, offset),
    lat,
    lon
  ];
}

initialize();

function stream(){
  console.log('streaming camera...');
  navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': true
  }).then( function(streamVideo) {
    var url = window.URL.createObjectURL(streamVideo);
    $('#camera').attr('src', url);
    $('#overlay').show();
  }).catch(function() {
        alert('Unable to access media');
  });
	$('#camera').addClass('video_background');
  $('#map').hide();
}

function selectISSLive(){
    console.log('starting ISS live');
    httpGet("https://api.wheretheiss.at/v1/satellites/25544",
        function(issLocation){
          goTo(issLocation.latitude, issLocation.longitude);
          setTimeout(stream, 1000);
    // setInterval(selectISSLive, 5000);
        });
}

function selectLandslide(){
  console.log('starting landslides...');
  httpGet("https://data.nasa.gov/resource/tfkf-kniw.json",
      function(landslides) {
        var locationElement = $('#location');
        var locationContainer = $('#location-container')
        locationContainer.show();
        var infoElement = $('#info');
        for(var i=0; i<5; i++) {
          var loc = landslides[i].adminname1;
          locationElement.append("<option value='" + i + "'>" + loc + "</option>");
        }

        locationElement.on('change', function(){
          var selectedLandslide = landslides[this.value];
          infoElement.text("Country: " + selectedLandslide.countryname + ", date: "+ selectedLandslide.date );
          goTo(selectedLandslide.latitude, selectedLandslide.longitude);
        });
  });
}

function initialize(){
  var dataSources = $('#datasource');
  dataSources.val(-1);

  dataSources.on('change', function(){
    switch(parseInt(this.value)) {
      case 0:
        selectLandslide();
        break;
      case 1:
        selectISSLive();
        break;
    }
  });

  jQuery('#overlay').width(jQuery('#camera').width()).height(jQuery('#camera').height()).css({top:jQuery('#camera').offset().top,left:jQuery('#camera').offset().left});
}

function httpGet(theUrl, success)
{
  $.get( theUrl, success).fail(function() {
    console.log( "error calling " + theUrl );
  });
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  // xmlHttp.send( null );
  // return xmlHttp.responseText;
}

function goTo(lat, lon){
    var bbox = getBBox(parseFloat(lat), parseFloat(lon), 100000);
    var url = 'http://www.openstreetmap.org/export/embed.html?bbox=' + bbox[0] + '%2C' + bbox[1] + '%2C' + bbox[2] + '%2C' + bbox[3] +  '&amp;layer=mapnik&amp;marker=' + lat + '%2C' + lon;
    $('#map').attr('src', url);
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
// using context
$('.ui.sidebar')
  .sidebar({
    context: $('.bottom.segment')
  })
  .sidebar('attach events', '.menu .item')
;

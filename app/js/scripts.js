initialize();

function stream(){
    var src = $('#camera').attr('src');
    if (src != undefined) {
        return;
    }

    console.log('streaming camera...');
    navigator.mediaDevices.enumerateDevices().then(
        function(devices) {
            var constraints = null;
            for (var device of devices) {
                if (device.kind == 'videoinput' && device.label.indexOf('back') !== -1) {
                    constraints = {
                        video: {
                            sourceId: device.deviceId,
                            optional: [{sourceId: device.deviceId}]
                        },
                        audio: false
                    };

                    // interrupt loop.
                    break;
                }
            }

            if (constraints == null) {
                constraints = {
                    audio: false,
                    video: true
                };
            }

            navigator.mediaDevices.getUserMedia(constraints).then(function(streamVideo) {
                var url = window.URL.createObjectURL(streamVideo);
                $('#camera').attr('src', url);
                $('.camera-container').show();

                $('#camera').addClass('video-background');
                $('#map').hide();
            }).catch(function() {
                alert('Unable to access media');
            });
        }
    );
}

function selectISSLive(){
    console.log('starting ISS live');
    httpGet("https://api.wheretheiss.at/v1/satellites/25544",
      function(issLocation){
        console.log(issLocation);
    httpGet("http://192.168.100.100/LAT=" + issLocation.latitude + "&LON=" + issLocation.longitude,
        function(){
          console.log('coordinates sent lat: ' + issLocation.latitude + ", lon:" + issLocation.longitude);
    } );

        getCountry(issLocation.latitude, issLocation.longitude, function(country) {
          var infoElement = $('#overlay');
          if(country == null) {
            infoElement.html("Country: I'm in the middle of nowhere!");
          }
          else {
            infoElement.html("Country: " + country.long_name);
          }
          }
        );
          setTimeout(stream, 1000);
        // setInterval(selectISSLive, 5000);
      }
    );
}

function selectSatLive(offset_lat, offset_lon){
    console.log('starting sat live');
    httpGet("https://api.wheretheiss.at/v1/satellites/25544",
        function(issLocation){
          getCountry(parseFloat(issLocation.latitude) + offset_lat, parseFloat(issLocation.longitude) + offset_lon,
            function(country) {
              var infoElement = $('#overlay');
              if(country == null) {
                infoElement.html("Country: I'm in the middle of nowhere!");
              }
              else {
                infoElement.html("Country: " + country.long_name);
              }
            });
      //post issLocation.latitude + offset_lat
          setTimeout(stream, 1000);
    // setInterval(selectISSLive, 5000);
        });
}

function selectLandslide(){
  console.log('starting landslides...');
  httpGet("https://data.nasa.gov/resource/tfkf-kniw.json",
      function(landslides) {
        var loc = getRandomInt(0,10);
        var infoElement = $('#overlay');
        var selectedLandslide = landslides[loc];
        console.log('Landslide selected:' + selectedLandslide.latitude);
        console.log(selectedLandslide);
        infoElement.html("Country: " + selectedLandslide.countryname + ", date: "+ selectedLandslide.date );
        stream();
  });
}

function selectAnimals(){
  var loc = getRandomInt(0,4);
  var infoElement = $('#overlay');
  var selectedCountry = animals()[loc];
  console.log('Country selected:' + selectedCountry.latitude);

  var ignoredFields = ['latitude', 'longitude'];
  var displayedData = [];
  for (item in selectedCountry) {
    if (ignoredFields.indexOf(item) == -1 && selectedCountry[item] != "0") {
      displayedData.push({
        label: item,
        value: selectedCountry[item]
      });
    }
  }

  addOverlayInfo(displayedData);
  stream();
}

function addOverlayInfo(info) {
    var list = $('<ul></ul>').attr('id', 'event-data');
    var infoElement = $('#overlay #event-data');

    for (var item of info) {
        $('<li>' + addIconFor(item.label) + item.value + '</li>').appendTo(list);
    }

    infoElement.replaceWith(list);
}

function addIconFor(label) {
    switch (label) {
        case "country":
            return '<i class="marker icon"></i>';
    }

    return '<strong>' + label.charAt(0).toUpperCase() + label.slice(1) + '</strong>: ';
}

function getCountry(lat, lon, fn){
  console.log('getting country');

  httpGet("http://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," + lon + "&sensor=false",
      function(country) {
        if(country.results.length == 0){
          fn(null)
        }
        else {
          country.results[0].address_components.forEach(function(el) {
            if(el.types[0] == "country"){
              console.log("Country fetched:" + el.long_name);
              fn(el);
            }
          });
        }
      }, function() {fn(null)});
}

function initialize(){
  var menu = $('.pushable .menu a');

  menu.on('click', function() {
    switch(this.id) {
      case 'landslides':
        selectLandslide();
        break;
      case 'iss':
        selectISSLive();
        break;
      case 'ses1':
        selectSatLive(getRandomInt(-50, 50), getRandomInt(-50, 50));
        break;
      case 'noaa18':
        selectSatLive(getRandomInt(-100, 100), getRandomInt(-100, 100));
        break;
      case 'animals':
        selectAnimals();
        break;
    }
  });

  jQuery('#overlay').css({top:jQuery('#camera').offset().top,left:jQuery('#camera').offset().left});
}

function httpGet(theUrl, success, fail)
{
  if(!fail) {fail=function(){};}
  $.get( theUrl, success).fail(function() {
    fail();
    console.log( "error calling " + theUrl );
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Menu handling
$('.ui.sidebar')
  .sidebar({
    context: $('.bottom.segment')
  })
  .sidebar('attach events', '.menu .item')
;

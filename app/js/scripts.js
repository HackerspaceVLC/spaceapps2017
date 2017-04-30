initialize();

function stream(){
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
          setTimeout(stream, 1000);
    // setInterval(selectISSLive, 5000);
        });
}

function selectSatLive(offset_lat, offset_lon){
    httpGet("https://api.wheretheiss.at/v1/satellites/25544",
        function(issLocation){
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
        infoElement.html("Country: " + selectedLandslide.countryname + ", date: "+ selectedLandslide.date );
        stream();
  });
}

function initialize(){
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
  var menu = $('.pushable .menu a');

  menu.on('click', function() {
    switch(this.id) {
      case 'landslides':
        selectLandslide();
        break;
      case 'iss':
        selectISSLive();
        break;
      case 'sas1':
        selectSatLive(getRandomInt(-100, 100), getRandomInt(-100, 100));
        break;
      case 'noaa18':
        selectSatLive(getRandomInt(-100, 100), getRandomInt(-100, 100));
        break;
      case 'animals':
        selectISSLive();
        break;
    }
  });

  jQuery('#overlay').css({top:jQuery('#camera').offset().top,left:jQuery('#camera').offset().left});
}

function httpGet(theUrl, success)
{
  $.get( theUrl, success).fail(function() {
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

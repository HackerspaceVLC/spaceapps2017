function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function postCoordinates(url, lat, lon) {
	$.post({url: url,
				data: { lat: lat, lon: lon},
				success: function(data){ console.log('post success');}

	}).fail(function() {
    console.log( "post error" );
  });
}

var landslides = httpGet("https://data.nasa.gov/resource/tfkf-kniw.json");
var json_landslides = JSON.parse(landslides);


var locationElement = $('#location');
var infoElement = $('#info');
locationElement.on('change', function(){
   var selectedLandslide = json_landslides[this.value];
    infoElement.text("Country: " + selectedLandslide.countryname + ", date: "+ selectedLandslide.date );
});

for(var i=0; i<5; i++) {
var loc = json_landslides[i].adminname1;
  locationElement.append("<option value='" + i + "'>" + loc + "</option>");
}





//console.log(json_landslides[0].latitude);


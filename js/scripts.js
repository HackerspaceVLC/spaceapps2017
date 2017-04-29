function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var landslides = httpGet("https://data.nasa.gov/resource/tfkf-kniw.json");
var json_landslides = JSON.parse(landslides);

console.log(json_landslides[0].latitude);


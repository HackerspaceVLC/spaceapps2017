#include<ESP8266WiFi.h>;

const char* ssid = "Hackerspace_VLC";
const char* password = "enblanco";
String req;
float latitud;
float longitud;

IPAddress ip(192,168,100,100);
IPAddress gateway(192,168,100,1);
IPAddress subnet(255,255,255,0);

// especificamos el puerto
WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  delay(10);
  
  // conectamos a alguna red WIFI
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  WiFi.config(ip, gateway, subnet);
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
 }
 Serial.println("");
 Serial.println("WiFi connected");
 // inciamos el servidor web
 
 server.begin();
 Serial.println("Server started");
 
 // imprimimos la direccion IP
 Serial.println(WiFi.localIP());
}
void loop() {
  // revisamos si el cliente esta conectado
  WiFiClient client = server.available();
  if (!client) {
  return;
  }
  
  // esperamos qu el cliente envie algun dato
  Serial.println("new client");
  while(!client.available()){
  delay(1);
  } 
  
  // leemos la primera linea de respuesta
  req = client.readStringUntil('\r');
  Serial.println(req);
  req.replace("GET /?LAT=","");
  req.replace("&LON=","&");
  req.replace(" HTTP/1.1","_");
  String lat=req.substring(0,req.indexOf("&"));
  String lon=req.substring(req.indexOf("&")+1,req.indexOf("_"));
  Serial.println(lat + "\n"+lon);
  latitud = lat.toFloat();
  longitud= lon.toFloat(); 
  /*client.print("latitud: ");
  client.print(latitud);
  client.print("\nlongitud: ");
  client.print(longitud);*/
    

 
  // enviamos la respuesta al cliente

  delay(4000);
  client.print("\nOK");
  Serial.println("Client disonnected");
  }

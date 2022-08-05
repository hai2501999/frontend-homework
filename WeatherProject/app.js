const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req,res){
  // console.log(req.body.cityName);
  // console.log("Post request recieved.");
  const query = req.body.cityName;
  const apiKey = "bde4a190d87ca0c29598ace8ab06310e";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey +"&q="+ query +"&units="+ unit;
  https.get(url, function(respond){
    console.log(respond.statusCode);

    respond.on("data", function(data){
      // console.log(data);
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const urlImage = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
      console.log(temp);
      console.log(description);
      console.log(icon);
      console.log(urlImage);
      res.write("<p>The weather is currently " + description + "</p>");
      res.write("<br><h1>The temperature in London is " + temp + " degrees Celcius.</h1>");
      res.write("<img src="+urlImage + ">");
      res.send();
    })
  });
})



app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})

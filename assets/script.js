var lat;
var long;

// find user's current location
function getLocation() {
  window.navigator.geolocation.getCurrentPosition(function (position) {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    console.log("Latitude: " + lat + " Longitude " + long)

    currentWeatherUrl = `${baseUrl}weather?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
    ajaxCall(currentWeatherUrl);
    // UVindexUrl = `${baseUrl}uvi?appid=${apiKey}&lat=${lat}&lon=${long}`;
    // ajaxCall(UVindexUrl);
    // forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
    // ajaxCall(forecastUrl);


    // old individual functions
    // currentWeather();
    // UVindex ();
    // forecast();
  })
}
getLocation();

var baseUrl = "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/"
var apiKey = "ba7557fe357f3ca6d72951aa5899a445";
var currentWeatherUrl;
var UVindexUrl;
var forecastUrl;

var data;

// populate with current location
function ajaxCall(x) {
  console.log("working");
  $.ajax({
    url: x,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    data = response;
    if (data.coord) {
      console.log("current weather call");
      currentWeather();
    }
    else if (data.lat) {
      console.log("UV index call");
      UVindex();
    }
    else if (data.cod) {
      console.log("forecast call");
      forecast();
    }
  });
}



// Current Weather for Current Location
function currentWeather() {
  // var currentWeatherUrl = `${baseUrl}weather?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;

  // $.ajax({
  //   url: currentWeatherUrl,
  //   method: "GET"
  // }).then(function (response) {
  //   console.log(response);
  // response.coord
  document.querySelector("#city").textContent = `${data.name} (${moment().format("MMM Do, YYYY")})`;
  document.querySelector("#temp").textContent = `Temperature: ${data.main.temp.toFixed(1)} ºF`;
  document.querySelector("#humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.querySelector("#wind-speed").textContent = `Wind Speed: ${data.wind.speed} MPH`;
  // jumbotron image change
  var currentIcon = data.weather[0].icon;
  document.querySelector(".jumbotron").setAttribute("style", `background-image: url("./assets/images/${weatherImg[currentIcon]}.jpg")`);
  // });
  UVindexUrl = `${baseUrl}uvi?appid=${apiKey}&lat=${lat}&lon=${long}`;
  ajaxCall(UVindexUrl);
  // forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
  // ajaxCall(forecastUrl);
}


// UV-Index for Current Location
function UVindex() {
  // var UVindexUrl = `${baseUrl}uvi?appid=${apiKey}&lat=${lat}&lon=${long}`;

  // $.ajax({
  //   url: UVindexUrl,
  //   methoc: "GET"
  // }).then(function (response) {
  //   console.log(response);
  //   // response.lat
  var button = document.createElement("button");
  if (data.value < 3) {
    button.className = "btn btn-success btn-lg";
  }
  else if (data.value >= 3 || data.value < 6) {
    button.className = "btn btn-warning btn-lg";
  }
  else if (data.value >= 6 || data.value < 8) {
    button.className = "btn btn-orange btn-lg";
  }
  else if (data.value >= 8) {
    button.className = "btn btn-danger btn-lg";
  }
  button.setAttribute("id", "uv-button");
  button.textContent = data.value;
  document.querySelector("#uv-index").appendChild(button);
  // });
  forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
  ajaxCall(forecastUrl);

}


// Forecast for Current Location
function forecast() {
  // var forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;

  // $.ajax({
  //   url: forecastUrl,
  //   method: "GET"
  // }).then(function (response) {
  //   console.log(response);
  //   // response.cod

  for (var i = 4; i < data.list.length; i += 8) {
    var div1 = document.createElement("div");
    div1.className = "card bg-light";
    document.querySelector(".card-deck").appendChild(div1);
    var div2 = document.createElement("div");
    div2.className = "card-body";
    div1.appendChild(div2);
    var text1 = document.createElement("h5");
    text1.className = "card-title";
    text1.textContent = `${data.list[i].dt_txt.slice(5, 7)}/${data.list[i].dt_txt.slice(8, 10)}/${data.list[i].dt_txt.slice(0, 4)}`;
    div2.appendChild(text1);
    var icon = document.createElement("h3");
    var iconNumber = data.list[i].weather[0].icon
    icon.className = weatherIcon[iconNumber];
    div2.appendChild(icon);
    var text2 = document.createElement("h6");
    text2.className = "text-muted";
    text2.textContent = `Temp: ${data.list[i].main.temp.toFixed(1)} ºF`;
    div2.appendChild(text2);
    var text3 = document.createElement("h6");
    text3.className = "text-muted";
    text3.textContent = `Humidity: ${data.list[i].main.humidity}%`;
    div2.appendChild(text3);
  }
  document.querySelector("#loading-column").setAttribute("style", "display: none");
  document.querySelector("#current-weather-column").classList.remove("d-none");
  // });
}

// icons for openweathermap
var weatherIcon = {
  "01d": "fas fa-sun",
  "01n": "fas fa-sun",
  "02d": "fas fa-cloud-sun",
  "02n": "fas fa-cloud-sun",
  "03d": "fas fa-cloud",
  "03n": "fas fa-cloud",
  "04d": "fas fa-cloud",
  "04n": "fas fa-cloud",
  "09d": "fas fa-cloud-rain",
  "09n": "fas fa-cloud-rain",
  "10d": "fas fa-cloud-showers-heavy",
  "10n": "fas fa-cloud-showers-heavy",
  "11d": "fas fa-bolt",
  "11n": "fas fa-bolt",
  "13d": "fas fa-snowflake",
  "13n": "fas fa-snowflake",
  "50d": "fas fa-smog",
  "50n": "fas fa-smog",
}

// images for openweathermap
var weatherImg = {
  "01d": "sunny",
  "01n": "sunny",
  "02d": "clouds",
  "02n": "clouds",
  "03d": "cloudy",
  "03n": "cloudy",
  "04d": "cloudy",
  "04n": "cloudy",
  "09d": "drizzle",
  "09n": "drizzle",
  "10d": "rain",
  "10n": "rain",
  "11d": "thunder",
  "11n": "thunder",
  "13d": "snow",
  "13n": "snow",
  "50d": "smog",
  "50n": "smog",
}


var searchBtn = document.querySelector("#search-button");
var citySearch = document.querySelector("#search-bar");

searchBtn.addEventListener("click", function () {
  event.preventDefault();

  console.log(citySearch.value);

})


// Previous Search Cities Buttons
// <button type="submit" class="btn bg-white border btn-block w-100 text-left">Atlanta</i></button>

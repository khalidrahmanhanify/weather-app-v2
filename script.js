const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const apiKey = "3ca20f0480412b9208d04af4a33e8b2f";
const currentWeatherCard = document.querySelectorAll(
  ".weather-data .weather-left .card"
)[0];
const fiveDaysForecastCard = document.querySelector(".day-forecast");
const aqiCard = document.querySelectorAll(".highlights .card")[0];
const sunriseCard = document.querySelectorAll(".highlights .card")[1];
const humidityVal = document.getElementById("humidityVal");
const pressureVal = document.getElementById("pressureVal");
const visibilityVal = document.getElementById("visibilityVal");
const windSpeedVal = document.getElementById("windSpeedVal");
const feelsVal = document.getElementById("feelsVal");
const hourlyForecastCard = document.querySelector(".hourly-forecast");
const loader = document.querySelector(".loader");
const aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
console.log(loader);
function showLoader() {
  loader.style.display = "inline-block";
}

function hideLoader() {
  loader.style.display = "none";
}
function getWeatherDetails(name, lat, lon, country, state) {
  showLoader();
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const AIR_POLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  fetch(AIR_POLUTION_API_URL)
    .then((res) => res.json())
    .then((response) => {
      hideLoader();
      const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } =
        response.list[0].components;
      aqiCard.innerHTML = `
          <div class="card-head">
              <p>Air Quality Index</p>
              <p class="air-index aqi-${response.list[0].main.aqi}">${
        aqiList[response.list[0].main.aqi - 1]
      }</p>
            </div>
            <div class="air-indices">
              <i class="fa-regular fa-wind fa-3x"></i>
              <div class="item">
                <p>PM<sub>2.5</sub></p>
                <h2>${pm2_5}</h2>
              </div>
              <div class="item">
                <p>PM<sub>10</sub></p>
                <h2>${pm10}</h2>
              </div>
              <div class="item">
                <p>SO<sub>2</sub></p>
                <h2>${so2}</h2>
              </div>
              <div class="item">
                <p>CO</p>
                <h2>${co}</h2>
              </div>
              <div class="item">
                <p>NO</p>
                <h2>${no}</h2>
              </div>
              <div class="item">
                <p>NO<sub>2</sub></p>
                <h2>${no2}</h2>
              </div>
              <div class="item">
                <p>NH<sub>3</sub></p>
                <h2>${nh3}</h2>
              </div>
              <div class="item">
                <p>O<sub>3</sub></p>
                <h2>${o3}</h2>
              </div>
            </div>
      `;
    })
    .catch(() => {
      hideLoader();
      alert("Faild to fetch Quality Index");
    });

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((response) => {
      hideLoader();
      console.log(response);
      let date = new Date();
      currentWeatherCard.innerHTML = `
            <div class="current-weather">
              <div class="details">
                <p>Now</p>
                <h2>${response.main.temp} &deg;C</h2>
                <p>${response.weather[0].description}</p>
              </div>
              <div class="weather-icon">
                <img
                  src="https://openweathermap.org/img/wn/${
                    response.weather[0].icon
                  }@2x.png"
                  alt=""
                />
              </div>
            </div>
            <hr />
            <div class="card-footer">
              <p><i class="fa-light fa-calendar"></i>${
                days[date.getDay()]
              }, ${date.getDate()}, ${
        months[date.getMonth()]
      }, ${date.getFullYear()}</p>
              <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
            </div>
        `;

      const { sunrise, sunset } = response.sys;
      const { timezone, visibility } = response;
      const { humidity, pressure, feels_like } = response.main;
      const { speed } = response.wind;

      sRiseTime = moment
        .utc(sunrise, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sSetTime = moment
        .utc(sunset, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunriseCard.innerHTML = `
        <div class="card-head">
                <p>Sunrise & sunset</p>
              </div>
              <div class="sunrise-sunset">
                <div class="item">
                  <div class="icon">
                    <i class="fa-light fa-sunrise fa-4x"></i>
                  </div>
                  <div>
                    <p>Sunrise</p>
                    <h2>${sRiseTime}</h2>
                  </div>
                </div>
                <div class="item">
                  <div class="icon">
                    <i class="fa-light fa-sunset fa-4x"></i>
                  </div>
                  <div>
                    <p>Sunset</p>
                    <h2>${sSetTime}</h2>
                  </div>
                </div>
              </div>  
      `;
      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure}hPa`;
      visibilityVal.innerHTML = `${visibility / 1000}km`;
      windSpeedVal.innerHTML = `${speed}m/s`;
      feelsVal.innerHTML = `${feels_like}&deg;C`;
    })
    .catch(() => {
      alert("Faild to fetch current weather");
      hideLoader();
    });

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((response) => {
      hideLoader();
      const hourlyForecast = response.list;
      hourlyForecastCard.innerHTML = "";
      for (let i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr -= 12;
        hourlyForecastCard.innerHTML += `
          <div class="card">
              <p>${hr} ${a}</p>
              <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="" />
              <p>${hourlyForecast[i].main.temp}&deg;C</p>
            </div>
        `;
      }
      let uniqueForecastDays = [];
      let fiveDaysForecast = response.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      fiveDaysForecastCard.innerHTML = "";
      for (let i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
            <div class="forecast-item">
             <div class="icon-wrapper">
            <img src="https://openweathermap.org/img/wn/${
              fiveDaysForecast[i].weather[0].icon
            }.png" alt="" />
            <span>${fiveDaysForecast[i].main.temp}&deg;C</span>
        </div>
        <p>${date.getDate()} ${months[date.getMonth()]}</p>
        <p>${days[date.getDay()]}</p>
        </div>
            `;
      }
    })
    .catch(() => {
      alert("Faild to fetch forecast weather");
      hideLoader();
    });
}

function getCityCordinates() {
  const cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(GEOCODING_API_URL)
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      const { name, lat, lon, country, state } = response[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch((err) => {
      alert(`Failed to fetch cordinates ${cityName}`);
      console.log(err);
    });
}

searchBtn.addEventListener("click", getCityCordinates);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getCityCordinates();
  }
});

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((response) => {
          const { name, country, state } = response[0];
          getWeatherDetails(name, latitude, longitude, country, state);
        })
        .catch(() => {
          alert("Failed to fetch user coordinates");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation permission denied. Please reset location permission to gran access again."
        );
      }
    }
  );
}

locationBtn.addEventListener("click", getUserCoordinates);
window.addEventListener("load", getUserCoordinates);

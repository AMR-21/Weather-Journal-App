"use strict";

// Personal API key and credentials for OpenWeatherMap API
const apiKey = "&appid=c33b2980f1ea7266f0fa9da172076f5a&units=imperial";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";

// //////////////////////////////////////////////////////////
//
// Elements
const recentsHolder = document.querySelector(".recents-holder");

// Items
const items = document.querySelectorAll(".info");
let entries = document.querySelectorAll(".entry");
const labelTemp = document.querySelector(".temp-main-value");
const labelDate = document.querySelector(".temp-main-date");
const labelStatus = document.querySelector(".status-text");
const labelLocation = document.querySelector(".city");
const labelMax = document.querySelector(".max");
const labelMin = document.querySelector(".min");
const labelFeels = document.querySelector(".feels-data");
const labelRise = document.querySelector(".rise-time");
const labelSet = document.querySelector(".set-time");
const labelHumidity = document.querySelector(".humidity-data");
const labelVisibility = document.querySelector(".visibility-data");
const labelWind = document.querySelector(".wind-data");

// Buttons
const btnGet = document.querySelector(".btn-get");

// Inputs
const inpZip = document.querySelector("#zip");
const inpFeel = document.querySelector("#feelings");

// //////////////////////////////////////////////////////////
// Date and time handlers
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function createDate(data) {
  const d = new Date();
  return `${days[d.getDay()]}, ${
    d.getMonth() + 1
  }/${d.getDate()}/${d.getFullYear()}`;
}

function createTime(data, time) {
  let unix_timestamp = data.sys[time] + data.timezone;

  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  const date = new Date(unix_timestamp * 1000);

  // Hours part from the timestamp
  const hours = "0" + date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  // Will display time in 10:30 format
  return `${hours.slice(-2)}:${minutes.slice(-2)} ${
    time === "sunrise" ? "AM" : "PM"
  }`;
}

// //////////////////////////////////////////////////////////
// GET/POST Handlers

const getWeatherInfo = async (zipCode = "10001") => {
  const res = await fetch(baseUrl + zipCode + apiKey);
  try {
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("Error:", e.message);
  }
};

const getData = async (url = "/all") => {
  const res = await fetch(url);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log("Error:", e.message);
  }
};

const postData = async (data, url = "/add") => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  try {
    const newData = await res.json();
    return newData;
  } catch (error) {
    console.log("Error:", error);
  }
};

// //////////////////////////////////////////////////////////////////////////
// UI Handlers
const updateEntries = (data) => {
  const entryFrag = document.createDocumentFragment();
  data.forEach((entry) => {
    const newEntry = document.createElement("div");

    newEntry.classList = "entry";

    newEntry.innerHTML = `<div id="date">${entry.date}, ${entry.location}, ${entry.country}</div>
            <div id="temp"><span class="field">Temperature</span>: <span class='ent-temp'>${entry.temperature}</span></div>
            <div id="feel"><span class="field">Feels Like</span>: <span class='ent-temp'>${entry.feels}</span></div>
            <div id="content">
              <span class="field">Feelings</span>:
              <span class="quote">“${entry.response}”</span>
            </div>`;

    entryFrag.prepend(newEntry);
  });

  recentsHolder.innerHTML = "";
  recentsHolder.append(entryFrag);

  entries = document.querySelectorAll(".entry");

  entries.forEach((entry) => {
    entry.addEventListener("mouseenter", enterHandler);
    entry.addEventListener("mouseleave", leaveHandler);
  });
};

const updateUI = async () => {
  const data = await getData();
  const current = data[data.length - 1];

  labelTemp.textContent = Math.trunc(current.temperature);

  labelDate.textContent = current.date;

  labelStatus.textContent = current.weather
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");

  labelLocation.textContent = `${current.location}, ${current.country}`;

  updateEntries(Object.values(data).slice(0, -1));

  labelMax.innerHTML = `${Math.trunc(
    current.tempMax
  )}<span class="info-unit">°F</span>`;

  labelMin.innerHTML = `${Math.trunc(
    current.tempMin
  )}<span class="info-unit">°F</span>`;

  labelFeels.innerHTML = `<span class="info-temp">${Math.trunc(
    current.feels
  )}<span class="info-unit">°F</span></span>`;

  labelRise.textContent = current.sunrise;

  labelSet.textContent = current.sunset;

  labelHumidity.innerHTML = `<span class="info-temp">${current.humidity}<span class="info-unit">%</span></span>`;

  labelVisibility.innerHTML = `<span class="info-temp">${Math.trunc(
    current.visibility / 1000
  )}<span class="info-unit-miles">miles</span></span>`;

  labelWind.innerHTML = `<span class="info-temp">${current.speed}<span class="info-unit-speed">mph</span></span>`;
};

// //////////////////////////////////////////////////////////////////////////
// Event Handlers

// Hover events
const enterHandler = (e) => {
  e.target.classList.add("active");
};

const leaveHandler = (e) => {
  e.target.classList.remove("active");
};

items.forEach((item) => {
  item.addEventListener("mouseenter", enterHandler);
  item.addEventListener("mouseleave", leaveHandler);
});

btnGet.addEventListener("click", (e) => {
  e.preventDefault();
  const feel = inpFeel.value;
  const zip = inpZip.value;
  if (zip !== "") {
    getWeatherInfo(zip)
      .then((data) => {
        try {
          const newEntry = {
            temperature: data.main.temp,
            feels: data.main.feels_like,
            humidity: data.main.humidity,
            tempMax: data.main.temp_max,
            tempMin: data.main.temp_min,
            location: data.name,
            country: data.sys.country,
            visibility: data.visibility,
            speed: data.wind.speed,
            response: feel,
            weather: data.weather[0].description,
            sunrise: createTime(data, "sunrise"),
            sunset: createTime(data, "sunset"),
            date: createDate(data),
          };
          postData(newEntry);
        } catch (e) {
          console.log("Error:", e.message);
        }
      })
      .then(() => {
        updateUI();
      });
  }
  inpFeel.value = inpZip.value = "";
  inpZip.blur();
  inpFeel.blur();
  btnGet.blur();
});

// //////////////////////////////////////////////////////////////////////////

// Initialization
getWeatherInfo()
  .then((data) => {
    try {
      const newEntry = {
        temperature: data.main.temp,
        feels: data.main.feels_like,
        humidity: data.main.humidity,
        tempMax: data.main.temp_max,
        tempMin: data.main.temp_min,
        location: data.name,
        country: data.sys.country,
        visibility: data.visibility,
        speed: data.wind.speed,
        response: "",
        weather: data.weather[0].description,
        sunrise: createTime(data, "sunrise"),
        sunset: createTime(data, "sunset"),
        date: createDate(data),
      };
      postData(newEntry);
    } catch (e) {
      console.log("Error:", e.message);
    }
  })
  .then(() => {
    updateUI();
  });

/* Global Variables */

// Personal API key and credentials for OpenWeatherMap API
const apiKey = "&appid=c33b2980f1ea7266f0fa9da172076f5a&units=imperial";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Elements
// const zipcodeArea = document.querySelector("#zip");
// const feelingsArea = document.querySelector("#feelings");
// const generateBtn = document.querySelector("#generate");
// const holder = document.querySelector(".entry");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// //////////////////////////////////////////////////////////
// Fetch Handlers

const getWeatherInfo = async (zipCode = "72959") => {
  const res = await fetch(baseUrl + zipCode + apiKey);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log("Error: ", e.message);
  }
};

const getData = async (url = "/all") => {
  const res = await fetch(url);
  try {
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("Error: ", e.message);
  }
};

const postData = async (data, url = "/add") => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

// //////////////////////////////////////////////////////////////////////////
// Event Handlers

// generateBtn.addEventListener("click", (e) => {
//   e.preventDefault();

//   getWeatherInfo(zipcodeArea.value)
//     .then((data) => {
//       const newEntry = {
//         temperature: data.main.temp,
//         date: newDate,
//         response: feelingsArea.value,
//       };
//       postData(newEntry);
//     })
//     .then(() => {
//       updateUI();
//     });
// });

// //////////////////////////////////////////////////////////////////////////
// Update UI function

const updateUI = async () => {
  const data = await getData();
  const current = data[data.length - 1];

  const newEntry = document.createElement("div");
  newEntry.id = "entryHolder";
  newEntry.innerHTML = `<div id="date">${current.date}</div>
  <temperature id="temp">${current.temperature}</div>
  <div id="content">${current.response}</div>
  `;

  holder.append(newEntry);
};

// console.log(data);

// let unix_timestamp = data.sys.sunrise + data.timezone;
// // Create a new JavaScript Date object based on the timestamp
// // multiplied by 1000 so that the argument is in milliseconds, not seconds.
// var date = new Date(unix_timestamp * 1000);
// console.log(date);
// // Hours part from the timestamp
// var hours = date.getHours();
// // Minutes part from the timestamp
// var minutes = "0" + date.getMinutes();
// // Seconds part from the timestamp
// var seconds = "0" + date.getSeconds();

// // Will display time in 10:30:23 format
// var formattedTime =
//   hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

// console.log(formattedTime);
// getWeatherInfo();

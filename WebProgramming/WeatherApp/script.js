let forecastDataGlobal = []; //Empty Array to store future data

//WEATHER INFO
async function getWeather() {
    const city = document.getElementById('city').value; //Input City Name
    const apiKey = 'da5cc509bc967933cf9f957a7a06eb9b'; //OpenWEatherMap API key (for data authorization)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const currentResponse = await fetch(currentWeatherUrl); //Fetch current weather from API
        const currentData = await currentResponse.json(); //Response

        updateCurrentWeather(currentData); //Updates main display and table with retrieved info

        const forecastResponse = await fetch(forecastWeatherUrl); //Fetch forecast data
        const forecastData = await forecastResponse.json(); //Response

        forecastData.list.forEach(item => {
          item.coord = currentData.coord;
        });

        forecastDataGlobal = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 4); //24h interval and 4 days

        const forecastDays = document.querySelectorAll('.day');
    
        forecastDays.forEach((day, index) => { //Loop to update each day data, icon and name
            const forecast = forecastDataGlobal[index];
            const forecastIcon = forecast.weather[0].icon;
            const weekday = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
            
            day.querySelector('.weekday').textContent = weekday;
            day.querySelector('.icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="forecast icon">`;
            day.querySelector('.temp').textContent = `${Math.round(forecast.main.temp)}°C`;

            if(index === 0) day.classList.add('selected'); //Select current day as default display

            day.onclick = () => { //Update main box and table to clicked day
                forecastDays.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                updateMainFromForecast(city, forecast);
            };
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateMainFromForecast(city, forecast) { //Updates display data from forecast
    document.getElementById('cityName').textContent = city;
    document.getElementById('temperature').textContent = `${Math.round(forecast.main.temp)}°C`;

    const icon = forecast.weather[0].icon;
    document.querySelector('.current-weather .icon').innerHTML =
        `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="forecast icon">`;

    const tableData = { //Prepare data for table
        name: city,
        main: forecast.main,
        weather: forecast.weather,
        wind: forecast.wind,
        rain: forecast.rain
    };
    addRowToTable(tableData); //Update table for the clicked forecast day

    //Get coordinates for pollution info:
    const lat = forecast.coord ? forecast.coord.lat : forecastDataGlobal[0].coord.lat;
    const lon = forecast.coord ? forecast.coord.lon : forecastDataGlobal[0].coord.lon;
    getPollution(lat, lon);

    //Outfit Game
    updateTemperatureForOutfit(forecast.main.temp);
}

function updateCurrentWeather(data) { //Updates main section with chosen day
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;

    const icon = data.weather[0].icon;
    document.querySelector('.current-weather .icon').innerHTML =
        `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">`;

    addRowToTable(data);

    //Pollution API
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    getPollution(lat, lon);

    //Outfit Game
    updateTemperatureForOutfit(data.main.temp);
}

function addRowToTable(data) {
    const tbody = document.querySelector('#detailsTable tbody');
    tbody.innerHTML = ''; 

    //If its raining update advice
    const rainfall = data.rain ? (data.rain['1h'] || 0) : 0;
    const mainCondition = data.weather[0].main.toLowerCase();
    const advice = (mainCondition.includes('rain') || mainCondition.includes('drizzle') || mainCondition.includes('thunderstorm'))
        ? 'Bring an umbrella!' 
        : 'No umbrella needed.';

    //Table content update
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.name}</td>
        <td>${Math.round(data.main.temp)}°C</td>
        <td>${data.weather[0].description}</td>
        <td>${advice}</td>
        <td>${data.wind.speed} km/h</td>
        <td>${rainfall} mm</td>
    `;
    tbody.appendChild(row); //Add row to the table
}

//POLLUTION INFO
async function getPollution(lat, lon) {
    const apiKey = 'da5cc509bc967933cf9f957a7a06eb9b';
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        const aqi = data.list[0].main.aqi; 
        const aqiText = ["Good","Fair","Moderate","Poor","Very Poor"][aqi-1] || "Unknown";

        //AQI
        document.getElementById('pollutionAQI').innerHTML = `<strong>AQI:</strong> <b>${aqi} - ${aqiText}</b>`;

        //Pollutant table
        const components = data.list[0].components;
        const tbody = document.querySelector('#pollutantsTable tbody');
        tbody.innerHTML = '';

        for (const [pollutant, value] of Object.entries(components)) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${pollutant.toUpperCase()}</td><td>${value}</td>`;
            tbody.appendChild(row);
        }

        const warnings = [];
        if (components.pm2_5 > 12) warnings.push(`PM2.5 is ${components.pm2_5} μg/m³ (Elevated, can affect lungs and aggravate asthma).`);
        if (components.pm10 > 20) warnings.push(`PM10 is ${components.pm10} μg/m³ (Elevated, can trigger allergies and respiratory irritation).`);
        if (components.co > 1000) warnings.push(`CO is ${components.co} μg/m³ (Elevated, reduces oxygen delivery in the body).`);
        if (components.no2 > 40) warnings.push(`NO2 is ${components.no2} μg/m³ (Elevated, irritates airways and worsens asthma).`);

        const warningContainer = document.getElementById('pollutionWarning');
        warningContainer.innerHTML = warnings.length > 0 
            ? `<strong>Warning:</strong><br>${warnings.join('<br>')}` 
            : "All measured pollutants are within 'Good' levels.";

    } catch (error) {
        console.error('Error fetching pollution data:', error);
        document.getElementById('pollutionAQI').textContent = 'Pollution data unavailable.';
        document.querySelector('#pollutantsTable tbody').innerHTML = '';
        document.getElementById('pollutionWarning').textContent = '';
    }
}

//GAME INFO
let selectedOutfit = new Set();
let currentTemp = null;

function updateTemperatureForOutfit(temp) {
  currentTemp = temp;
  checkOutfit(); 
}

document.querySelectorAll('.outfit-btn').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    if (selectedOutfit.has(item)) {
      selectedOutfit.delete(item);
      button.classList.remove('selected');
    } else {
      selectedOutfit.add(item);
      button.classList.add('selected');
    }
    checkOutfit();
  });
});

function checkOutfit() {
  if (currentTemp === null) return;

  const warmthPoints = {
    scarf: 2,
    jacket: 4,
    jumper: 3,
    shirt: 1,
    longPants: 2,
    shortPants: 1,
    shoes: 1,
    boots: 2
  };
  let totalWarmth = 0;
  selectedOutfit.forEach(item => {
    totalWarmth += warmthPoints[item] || 0;
  });

  const adviceText = document.getElementById('outfitAdvice');
  const instructionText = document.getElementById('outfitInstruction');
  let feedback = '';

  if (currentTemp < 10) {
    if (totalWarmth < 13) feedback = "It will be too cold, try adding another layer!";
    else feedback = " Great choice! Ready for chilly weather!";
  } else if (currentTemp >= 10 && currentTemp < 20) {
    if (totalWarmth < 7) feedback = "Might be a bit cool, maybe add another layer.";
    else if (totalWarmth > 11) feedback = "Too warm, try removing a layer!";
    else feedback = "Great choice! Ready to go for today!";
  } else if (currentTemp >= 20 && currentTemp < 25){
    if (totalWarmth < 4) feedback = "Might be a bit cool, maybe add another layer.";
    else if (totalWarmth > 6) feedback = "Too warm, try removing a layer!";
    else feedback = "Great choice! Ready to go for a warm day!";
  } else {
    if (totalWarmth >= 4) feedback = "It will be a bit warm, try removing a layer.";
    else if (totalWarmth === 0) feedback = "Let's add some layers!";
    else if (totalWarmth < 3) feedback = "Let's add more layers!";
    else feedback = "Great choice! Ready for a very warm day! Make sure not to forget sunscream :]";
  }

  adviceText.textContent = feedback;
  instructionText.textContent = "• Let's see if your outfit is temperature approved!";
}

// Pressing Enter Key to also trigger search
document.getElementById('city').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});
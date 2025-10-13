let forecastDataGlobal = []; //Empty Array to store future data

//WEATHER INFO
async function getWeather() {
    const city = document.getElementById('city').value; //Input City Name
    const apiKey = 'e71d91357891aa32f75d92c0038ca182'; //OpenWEatherMap API key (for data authorization)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; //current weather
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`; //future weather

    try {
        const currentResponse = await fetch(currentWeatherUrl); //Fetch current weather from API
        const currentData = await currentResponse.json(); //Response

        updateCurrentWeather(currentData); //Updates main display and table with retrieved info

        const forecastResponse = await fetch(forecastWeatherUrl); //Fetch forecast data
        const forecastData = await forecastResponse.json(); //Response

        forecastData.list.forEach(item => { //Coordinates for pollution info
          item.coord = currentData.coord;
        });

        forecastDataGlobal = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 4); //24h interval and 4 days

        const forecastDays = document.querySelectorAll('.day');
    
        forecastDays.forEach((day, index) => { //Loop to update each day data, icon and name
            const forecast = forecastDataGlobal[index];
            const forecastIcon = forecast.weather[0].icon;
            const weekday = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
            
            //Update Display boxes:
            day.querySelector('.weekday').textContent = weekday;
            day.querySelector('.icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="forecast icon">`;
            day.querySelector('.temp').textContent = `${Math.round(forecast.main.temp)}°C`;

            if(index === 0) day.classList.add('selected'); //Select current day as default display

            day.onclick = () => { //Update main box and table to clicked day
                forecastDays.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                updateMainFromForecast(city, forecast);

                const weekday = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
                updateTemperatureForOutfit(forecast.main.temp, city, weekday);
            };
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateCurrentWeather(data) { //Updates main display section with current data
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
    updateTemperatureForOutfit(data.main.temp, data.name, new Date().toLocaleDateString('en-US', { weekday: 'long' }));
}

function updateMainFromForecast(city, forecast) { //Updates display data to selected day from forecast
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
    const weekday = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
    updateTemperatureForOutfit(forecast.main.temp, city, weekday);
}

//TABLE INFO
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
    const apiKey = 'e71d91357891aa32f75d92c0038ca182';
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        //AQI (Air Quality Index)
        const aqi = data.list[0].main.aqi; 
        const aqiText = ["Good","Fair","Moderate","Poor","Very Poor"][aqi-1] || "Unknown";
        document.getElementById('pollutionAQI').innerHTML = `<strong>AQI:</strong> <b>${aqi} -> ${aqiText}</b>`; //AQI display

        //Pollutant table:
        const components = data.list[0].components;
        const tbody = document.querySelector('#pollutantsTable tbody');
        tbody.innerHTML = '';

        for (const [pollutant, value] of Object.entries(components)) { //Loop and get eahc polllutant with its value to add to table
            const row = document.createElement('tr');
            row.innerHTML = `<td>${pollutant.toUpperCase()}</td><td>${value}</td>`;
            tbody.appendChild(row);
        }

        //Warnings regarding pollutant info:
        const elevated = [];
        /*if (components.pm2_5 > 12) warnings.push(`PM2.5 is ${components.pm2_5} μg/m³ (Elevated, can affect lungs and aggravate asthma).`);
        if (components.pm10 > 20) warnings.push(`PM10 is ${components.pm10} μg/m³ (Elevated, can trigger allergies and respiratory irritation).`);
        if (components.co > 1000) warnings.push(`CO is ${components.co} μg/m³ (Elevated, reduces oxygen delivery in the body).`);
        if (components.no > 40) warnings.push(`NO is ${components.no} μg/m³ — Can oxidize to NO2, irritating airways and worsening asthma.`);
        if (components.no2 > 40) warnings.push(`NO2 is ${components.no2} μg/m³ (Elevated, irritates airways and worsens asthma).`);
        if (components.o3 > 100) warnings.push(`O3 is ${components.o3} μg/m³ — Ground-level ozone can cause coughing, throat irritation, and chest pain.`);
        if (components.so2 > 20) warnings.push(`SO2 is ${components.so2} μg/m³ — Can cause breathing difficulties and aggravate existing lung diseases.`);
        if (components.nh3 > 200) warnings.push(`NH3 is ${components.nh3} μg/m³ — Ammonia exposure can irritate eyes, nose, and throat.`);
        //NEED RO ADD MORE OF THE POLLUTANTS THAT DISPLAY*/

        //Risk level of pollutants analysis
        function assessLevel(name, value, levels) {
            for (let i = levels.length - 1; i >= 0; i--) {
                if (value > levels[i].limit) {
                    elevated.push({
                        name,
                        value,
                        label: levels[i].label,
                        color: levels[i].color,
                        effect: levels[i].effect
                    });
                    return;
                }
            }
        }
        // Thresholds based on WHO/EU guidelines
        assessLevel("PM2.5", components.pm2_5, [
            { limit: 75, label: "Very High", color: "red", effect: "Dangerous for everyone, stay indoors and avoid exertion." },
            { limit: 35, label: "High", color: "orange", effect: "Unhealthy for sensitive groups, avoid long outdoor exposure." },
            { limit: 12, label: "Moderate", color: "goldenrod", effect: "Acceptable, but can irritate lungs in sensitive people." }
        ]);

        assessLevel("PM10", components.pm10, [
            { limit: 150, label: "Very High", color: "red", effect: "Can cause coughing, throat irritation, and worsen asthma." },
            { limit: 50, label: "High", color: "orange", effect: "Irritation possible for children and elderly." },
            { limit: 20, label: "Moderate", color: "goldenrod", effect: "Slightly elevated, may affect sensitive individuals." }
        ]);

        assessLevel("CO", components.co, [
            { limit: 10000, label: "Very High", color: "red", effect: "Toxic, may cause dizziness, headaches, or confusion." },
            { limit: 2000, label: "High", color: "orange", effect: "Reduced oxygen delivery, avoid enclosed spaces." },
            { limit: 1000, label: "Moderate", color: "goldenrod", effect: "Slightly elevated, mild effects possible." }
        ]);

        assessLevel("NO", components.no, [
            { limit: 100, label: "Very High", color: "red", effect: "Highly reactive, can damage lung tissue at high levels." },
            { limit: 60, label: "High", color: "orange", effect: "Irritates airways and contributes to NO2 formation." },
            { limit: 40, label: "Moderate", color: "goldenrod", effect: "Slightly elevated, could affect asthmatics." }
        ]);

        assessLevel("NO₂", components.no2, [
            { limit: 200, label: "Very High", color: "red", effect: "Severe airway irritation; avoid outdoor activity." },
            { limit: 100, label: "High", color: "orange", effect: "Can worsen asthma and lung function." },
            { limit: 40, label: "Moderate", color: "goldenrod", effect: "Mild airway irritation possible." }
        ]);

        assessLevel("O₃", components.o3, [
            { limit: 180, label: "Very High", color: "red", effect: "Harmful to breathe, causes chest pain and coughing." },
            { limit: 120, label: "High", color: "orange", effect: "Uncomfortable for children, elderly, and asthmatics." },
            { limit: 100, label: "Moderate", color: "goldenrod", effect: "Slight irritation of eyes and throat possible." }
        ]);

        assessLevel("SO₂", components.so2, [
            { limit: 150, label: "Very High", color: "red", effect: "Can cause breathing difficulties and lung inflammation." },
            { limit: 50, label: "High", color: "orange", effect: "Unhealthy for asthmatics and people with lung disease." },
            { limit: 20, label: "Moderate", color: "goldenrod", effect: "Slightly elevated, may irritate airways." }
        ]);

        assessLevel("NH₃", components.nh3, [
            { limit: 1000, label: "Very High", color: "red", effect: "Toxic at high levels, eye and throat irritation." },
            { limit: 400, label: "High", color: "orange", effect: "Can cause discomfort to eyes and respiratory tract." },
            { limit: 200, label: "Moderate", color: "goldenrod", effect: "Mild irritation possible for sensitive people." }
        ]);

        const warningContainer = document.getElementById('pollutionWarning');

        if (elevated.length === 0) {
            warningContainer.innerHTML = `<span style="color:green;">All measured pollutants are within 'Good' levels.</span>`;
        } else {
            let msg = `<span style="color:red; ">Warning: Elevated pollutant levels detected!</span><br><br>`;
            elevated.forEach(p => {
                msg += `<b>${p.name}</b>: ${p.value} μg/m³ —> <span style="color:${p.color}; ">${p.label}</span>. ${p.effect}<br>`;
            });
            warningContainer.innerHTML = msg;
        }

    } catch (error) {
        console.error('Error fetching pollution data:', error);
        document.getElementById('pollutionAQI').textContent = 'Pollution data unavailable.';
        document.querySelector('#pollutantsTable tbody').innerHTML = '';
        document.getElementById('pollutionWarning').textContent = '';
    }
}

//GAME INFO
// Outfit game reveal after button is pressed:
document.getElementById('startGameBtn').addEventListener('click', () => {
  document.getElementById('gameIntro').style.display = 'none';
  const game = document.getElementById('gameContent');
  game.style.display = 'block';
  setTimeout(() => game.classList.add('show'), 50);
});

let selectedOutfit = new Set();
let currentTemp = null;

function updateTemperatureForOutfit(temp, city = null, weekday = null) { //Gets current temperature we want to choose outfit for
  currentTemp = temp;
  if (city) document.getElementById('outfitCity').innerHTML = `<strong>City:</strong> ${city}`;
  if (weekday) document.getElementById('outfitDayTemp').innerHTML = `<strong>Day:</strong> ${weekday} | <strong>Temp:</strong> ${Math.round(temp)}°C`;
  checkOutfit(); 
}

//Buttons for game handling (Select/Unselect):
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

//Outfit game logic
function checkOutfit() {
  if (currentTemp === null) return;
  //Assign data points to each item:
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
    totalWarmth += warmthPoints[item] || 0; //Add points to get total outfit points
  });

  //Feedback to chosen outfit comparing points and temperature
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

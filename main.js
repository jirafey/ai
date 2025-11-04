function requestCurrentWeather() {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        const API = '7ded80d91f2b280ec979100cc8bbba94';
        const city = document.getElementById('city_input').value;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API}`;

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const weatherData = JSON.parse(this.responseText);
                    console.log('Current Weather (XHR):', weatherData);
                    resolve(weatherData);
                } else {
                    reject(new Error(`Current Weather request failed with status: ${this.status}`));
                }
            }
        };

        xhttp.onerror = function() {
            reject(new Error('Network error occurred during Current Weather request.'));
        };
        
        xhttp.open('GET', url, true);
        xhttp.send();
    });
}

async function fetchForecast() {
    const API = '7ded80d91f2b280ec979100cc8bbba94';
    const city = document.getElementById('city_input').value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const forecastData = await response.json();
        console.log('Forecast Data (Fetch):', forecastData);
        return forecastData;
    } catch(error) {
        console.error(error.message);
        throw error;
    }
}
async function apiResponseStyling() {
    const outputContainer = document.getElementById('apiOutput');
    outputContainer.innerHTML = 'Fetching data...';

    try {
        const [weatherData, forecastData] = await Promise.all([
            requestCurrentWeather(),
            fetchForecast()
        ]);

        outputContainer.innerHTML = '';

        if (weatherData) {
            const currentCard = createWeatherCard(weatherData, true);
            outputContainer.appendChild(currentCard);
        }

        if (forecastData && forecastData.list) {
            forecastData.list.forEach(item => {
                const forecastCard = createWeatherCard(item, false);
                outputContainer.appendChild(forecastCard);
            });
        }

    } catch (error) {
        outputContainer.innerText = `Error: ${error.message}`;
        console.error("Failed to style API response: ", error);
    }
}

function createWeatherCard(data, isCurrent) {
    const dateText = isCurrent ? new Date(data.dt * 1000).toLocaleString() : data.dt_txt;
    const icon = data.weather[0].icon;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const description = data.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const card = document.createElement('div');
    card.className = 'weather-card';

    card.innerHTML = `
        <div class="date">${dateText}</div>
        <img src="${iconUrl}" alt="${description}" class="icon">
        <div class="temp-details">
            <p class="temp">${temp.toFixed(2)} °C</p>
            <p class="feels-like">Feel: ${feelsLike.toFixed(2)} °C</p>
            <p class="description">${description}</p>
        </div>
    `;

    return card;
}
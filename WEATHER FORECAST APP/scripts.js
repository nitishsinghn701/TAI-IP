const apiKey = '426e1ac16eb1377b8f547aab0cdb4430';

document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const forecastPage = document.getElementById('forecast-page');
    const searchForm = document.getElementById('search-form');
    const locateBtn = document.getElementById('locate-btn');
    const homeBtn = document.getElementById('home-btn');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const errorMessage = document.querySelector('.error-message');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = document.getElementById('city-search').value.trim();
        if (city) {
            fetchWeatherByCity(city);
        } else {
            showErrorMessage('Please enter a city name.');
        }
    });

    locateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    showErrorMessage('Geolocation permission denied.');
                }
            );
        } else {
            showErrorMessage('Geolocation is not supported by this browser.');
        }
    });

    homeBtn.addEventListener('click', () => {
        homePage.classList.add('visible');
        forecastPage.classList.remove('visible');
    });

    function fetchWeatherByCity(city) {
        toggleLoadingIndicator(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    updateUI(data);
                    showPage(forecastPage);
                } else {
                    showErrorMessage(data.message);
                }
            })
            .catch(error => showErrorMessage('Error fetching weather data.'))
            .finally(() => toggleLoadingIndicator(false));
    }

    function fetchWeatherByCoordinates(lat, lon) {
        toggleLoadingIndicator(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    updateUI(data);
                    showPage(forecastPage);
                } else {
                    showErrorMessage(data.message);
                }
            })
            .catch(error => showErrorMessage('Error fetching weather data.'))
            .finally(() => toggleLoadingIndicator(false));
    }

    function updateUI(data) {
        document.querySelector('.city-name').textContent = data.name;
        document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector('.forecast-condition').textContent = data.weather[0].description;
        document.querySelector('.feels-like').textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
        document.querySelector('.humidity').textContent = `Humidity: ${data.main.humidity}%`;

        const currentDate = new Date();
        document.querySelector('.date-today').textContent = currentDate.toDateString();

        const weatherIconClass = getWeatherIcon(data.weather[0].main);
        document.querySelector('.forecast-description i').className = `wi ${weatherIconClass}`;
    }

    function showPage(page) {
        homePage.classList.remove('visible');
        forecastPage.classList.add('visible');
    }

    function toggleLoadingIndicator(show) {
        if (show) {
            loadingIndicator.classList.remove('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }

    function getWeatherIcon(weather) {
        const iconMapping = {
            'Clear': 'wi-day-sunny',
            'Clouds': 'wi-cloudy',
            'Rain': 'wi-rain',
            'Thunderstorm': 'wi-thunderstorm',
            'Drizzle': 'wi-sprinkle',
            'Snow': 'wi-snow',
            'Mist': 'wi-fog',
            'Smoke': 'wi-smoke',
            'Haze': 'wi-day-haze',
            'Fog': 'wi-fog',
            'Sand': 'wi-sandstorm',
            'Dust': 'wi-dust',
            'Ash': 'wi-volcano',
            'Squall': 'wi-strong-wind',
            'Tornado': 'wi-tornado'
        };
        return iconMapping[weather] || 'wi-na';
    }
});

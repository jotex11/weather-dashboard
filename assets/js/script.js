$(document).ready(function () {
    // Define variables for DOM elements
    let col2El = $(".col2");
    let fivDayEl = $("#five-day");
    let searchHistoryEl = $("#search-history");

    // Load search history from local storage and create history buttons
    function loadHistory() {
        let searchHistory = localStorage.getItem('searchHistory');
        if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
            for (let i = 0; i < searchHistory.length; i++) {
                createHistoryButton(searchHistory[i]);
            }
        }
    }

    // Save city to search history in local storage and create history button
    function saveHistory(city) {
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        createHistoryButton(city);
    }

    // Create a history button for a city
    function createHistoryButton(city) {
        let historyBtn = $('<button>')
            .addClass('btn')
            .text(city)
            .on('click', function () {
                $("#current-weather").remove();
                $("#five-day").empty();
                $("#five-day-header").remove();
                getWeather(city);
            })
            .attr({
                type: 'button'
            });

        searchHistoryEl.append(historyBtn);
    }

    // Get weather data for a city using OpenWeatherMap API
    function getWeather(city) {
        let apiKey = "9df96985a7bdae925d0041c4da8ecbb2";
        let weatherURL = "https://api.openweathermap.org/data/2.5/forecast?";
        let apiCallURL = "https://api.openweathermap.org/data/3.0/onecall/day_summary?";
        let apiCoordinatesURL = weatherURL + 'q=' + city + '&appid=' + apiKey;
        let currentDay = dayjs();

        fetch(apiCoordinatesURL)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching weather data:', response.status);
                }
            })
            .then(function (data) {
                let cityLat = data.coord.lat;
                let cityLong = data.coord.lon;
                let apiCall = apiCallURL + cityLat + '&lon=' + cityLong + '&appid=' + apiKey + '&units=imperial';

                fetch(apiCall)
                    .then(function (weatherResponse) {
                        if (weatherResponse.ok) {
                            return weatherResponse.json();
                        } else {
                            throw new Error('Error fetching weather data:', weatherResponse.status);
                        }
                    })
                    .then(function (weatherData) {
                        let currWeather = $('<div>')
                            .attr({
                                id: 'current-weather'
                            });

                        let cityNameEl = $('<h2>')
                            .addClass('weather')
                            .text(city);

                        let currentDateEl = $('<p>')
                            .addClass('date')
                            .text(currentDay.format('MM/DD/YYYY'));

                        let tempEl = $('<p>')
                            .addClass('temp')
                            .text('Temperature: ' + weatherData.current.temp + ' °F');

                        let humidityEl = $('<p>')
                            .addClass('humidity')
                            .text('Humidity: ' + weatherData.current.humidity + '%');

                        let windSpeedEl = $('<p>')
                            .addClass('wind')
                            .text('Wind Speed: ' + weatherData.current.wind_speed + ' MPH');

                        let weatherIcon = $('<img>')
                            .attr({
                                src: "picture URL", // Replace with your picture URL
                                alt: "Weather Icon",
                            })
                            .addClass('weather-icon');

                        currWeather.append(cityNameEl, currentDateEl, tempEl, humidityEl, windSpeedEl, weatherIcon);
                        col2El.append(currWeather);
                    })
                    .catch(function (error) {
                        console.error('Error fetching weather data:', error);
                    });
            })
            .catch(function (error) {
                console.error('Error fetching weather data:', error);
            });
    }

    // start the page
    loadHistory();
    getWeather();
});
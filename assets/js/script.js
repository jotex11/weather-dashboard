// Here is an enhanced and improved version of the 'code_under_test' code snippet:

$(document).ready(function () {
    // Define variables for DOM elements
    var col2El = $(".col2");
    var fivDayEl = $("#five-day");
    var searchHistoryEl = $("#search-history");
    let searchHistory = loadHistory();

    // Load search history from local storage and create history buttons
    function loadHistory() {
        let searchHistory = localStorage.getItem('search-history');
        if (!searchHistory) {
            searchHistory = {
                searchedCity: [],
            };
        } else {
            for (let i = 0; i < searchHistory.searchedCity.length; i++) {
                search(searchHistory.searchedCity[i]);
            }
        }
        return searchHistory;
    }

    // Create a history button for a city
    function createHistoryButton(city) {
        // Create a button element using jQuery
        const historyBtn = $('<button>')
            .addClass('btn')
            .text(city)
            .on('click', function () {
                // Remove the current weather and five-day forecast elements
                $("#current-weather").remove();
                $("#five-day").empty();
                $("#five-day-header").remove();
                // Call the getWeather function with the city as an argument
                getWeather(city);
            })
            .attr({
                type: 'button'
            });

        // Append the history button to the search history element
        searchHistoryEl.append(historyBtn);
    }

    function cityLocation(cityname, state) {
        let cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q=';
        if (state) {
            cityURL += `${cityname}, ${state}, US`;
        } else {
            cityURL += cityname;
        }
        cityURL += "&appid=" + apiKey;

        fetch(cityURL)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error fetching city URL', response.status);
                }
            })
            .then((data) => {
                // Update the city info element with the retrieved weather data
                const cityInfo = document.getElementById('city-info');
                cityInfo.innerHTML = `
                    <p>City: ${data.name}</p>
                    <p>Temp: ${data.main.temp}</p>
                `;
            })
            .catch((error) => {
                console.error('Error fetching city URL', error);
            });
    }

    // Get weather data for a city using OpenWeatherMap API
    function getWeather(city) {
        // Define the API key and weather URL
        var apiKey = '9df96985a7bdae925d0041c4da8ecbb2';
        var weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`;

        // Make an API call to fetch weather data
        fetch(weatherURL)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Error fetching weather data', response.status);
                }
            })
            .then((data) => {
                // Update the city info element with the retrieved weather data
                var cityInfo = document.getElementById('city-info');
                cityInfo.innerHTML = `
                    <p>City: ${data.name}</p>
                    <p>Temp: ${data.main.temp}</p>
                `;
            })
            .catch((error) => {
                console.error('Error fetching weather data', error);
            });
    }

    // Initialize the page
    $(document).ready(function () {
        // Load search history
        loadHistory();
        // Get weather data for the default city
        getWeather();
    });
});
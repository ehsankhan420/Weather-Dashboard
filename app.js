const weatherApiUrl = "https://api.openweathermap.org/data/2.5/";
const weatherApiKey = "714b8773b590a64b6dae03b1852ec05a"; // Your API Key
const geminiApiKey = "AIzaSyDqTbnaMXyMSTT5b8-AAGXY6MwgYo5Cql8"; // Your Gemini API Key

let currentWeatherData = null;
let forecastData = null;
let isFahrenheit = false;
let currentPage = 1;
const itemsPerPage = 10;

// Show loading spinner
function showSpinner() {
  document.getElementById('loading-spinner').classList.remove('hidden');
}

// Hide loading spinner
function hideSpinner() {
  document.getElementById('loading-spinner').classList.add('hidden');
}

// Fetch current weather data
async function getWeatherData(city) {
  try {
    const response = await fetch(`${weatherApiUrl}weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    return await response.json();
  } catch (error) {
    alert(error.message);
    return null;
  }
}

// Fetch 5-day weather forecast data
async function getForecastData(city) {
  try {
    const response = await fetch(`${weatherApiUrl}forecast?q=${city}&appid=${weatherApiKey}&units=metric`);
    if (!response.ok) throw new Error('Forecast not available');
    return await response.json();
  } catch (error) {
    alert(error.message);
    return null;
  }
}

// Display current weather
function displayWeather(data) {
  currentWeatherData = data;
  document.getElementById('city-name').textContent = data.name;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('weather-description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
}

// Display paginated forecast
function displayPaginatedForecast(forecast, page = 1) {
  const tableBody = document.querySelector('#forecast-table tbody');
  tableBody.innerHTML = ''; // Clear the table

  if (!forecast || !forecast.list) {
    tableBody.innerHTML = `<tr><td colspan="4">No forecast data available</td></tr>`;
    return;
  }

  // Calculate start and end index for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the forecast list for the current page
  const paginatedItems = forecast.list.slice(startIndex, endIndex);
  paginatedItems.forEach(item => {
    const row = document.createElement('tr');
    const date = new Date(item.dt_txt).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`; // Weather icon URL

    row.innerHTML = `
    <td>${date}</td>
    <td>${item.main.temp}°C</td>
    <td>${item.weather[0].description}</td>
    <td><img src="${iconUrl}" alt="Weather icon" class="forecast-icon"></td> <!-- Updated class name -->
  `;
  
    tableBody.appendChild(row);
  });

  // Update page number
  document.getElementById('page-number').textContent = `Page ${currentPage}`;
}

// Pagination control
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayPaginatedForecast(forecastData, currentPage);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (forecastData && forecastData.list) {
    const totalPages = Math.ceil(forecastData.list.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayPaginatedForecast(forecastData, currentPage);
    }
  }
});

// Search city and display weather and forecast
document.getElementById('get-weather').addEventListener('click', async () => {
  const city = document.getElementById('city-input').value.trim();

  // Validate city input
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Show spinner while fetching data
  showSpinner();

  // Fetch weather and forecast data
  const weatherData = await getWeatherData(city);
  if (weatherData) {
    forecastData = await getForecastData(city);
    if (forecastData) {
      currentPage = 1;  // Reset to the first page when new data is fetched
      displayPaginatedForecast(forecastData, currentPage);
    }
  }

  // Hide spinner after fetching data
  hideSpinner();
});

// Function to sort temperatures in ascending order
function sortTemperaturesAscending(forecast) {
  return forecast.list.slice().sort((a, b) => a.main.temp - b.main.temp);
}

// Function to sort temperatures in descending order
function sortTemperaturesDescending(forecast) {
  return forecast.list.slice().sort((a, b) => b.main.temp - a.main.temp);
}

// Function to filter out days without rain
function filterRainyDays(forecast) {
  return forecast.list.filter(item => item.weather[0].description.toLowerCase().includes('rain'));
}

// Function to get the day with the highest temperature
function getHighestTemperatureDay(forecast) {
  return forecast.list.reduce((highest, item) => {
    return item.main.temp > highest.main.temp ? item : highest;
  }, forecast.list[0]);
}

// Display sorted temperatures (ascending or descending) and filtered data
function displaySortedOrFilteredForecast(sortedForecast, page = 1) {
  const tableBody = document.querySelector('#forecast-table tbody');
  tableBody.innerHTML = ''; // Clear the table

  // Slice the sorted forecast list for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedForecast.slice(startIndex, endIndex);

  paginatedItems.forEach(item => {
    const row = document.createElement('tr');
    const date = new Date(item.dt_txt).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`; // Weather icon URL

    row.innerHTML = `
      <td>${date}</td>
      <td>${item.main.temp}°C</td>
      <td>${item.weather[0].description}</td>
      <td><img src="${iconUrl}" alt="Weather icon" class="forecast-icon"></td>
    `;
    
    tableBody.appendChild(row);
  });

  // Update page number
  document.getElementById('page-number').textContent = `Page ${currentPage}`;
}

// Button to show temperatures in ascending order
document.getElementById('sort-asc').addEventListener('click', () => {
  const sortedForecast = sortTemperaturesAscending(forecastData);
  displaySortedOrFilteredForecast(sortedForecast, currentPage);
});

// Button to show temperatures in descending order
document.getElementById('sort-desc').addEventListener('click', () => {
  const sortedForecast = sortTemperaturesDescending(forecastData);
  displaySortedOrFilteredForecast(sortedForecast, currentPage);
});

// Button to filter out days without rain
document.getElementById('filter-rain').addEventListener('click', () => {
  const rainyDaysForecast = filterRainyDays(forecastData);
  displaySortedOrFilteredForecast(rainyDaysForecast, currentPage);
});

// Button to show the day with the highest temperature
document.getElementById('highest-temp').addEventListener('click', () => {
  const highestTempDay = getHighestTemperatureDay(forecastData);
  const tableBody = document.querySelector('#forecast-table tbody');
  tableBody.innerHTML = ''; // Clear the table
  
  const row = document.createElement('tr');
  const date = new Date(highestTempDay.dt_txt).toLocaleDateString();
  const iconUrl = `https://openweathermap.org/img/wn/${highestTempDay.weather[0].icon}@2x.png`; // Weather icon URL

  row.innerHTML = `
    <td>${date}</td>
    <td>${highestTempDay.main.temp}°C</td>
    <td>${highestTempDay.weather[0].description}</td>
    <td><img src="${iconUrl}" alt="Weather icon" class="forecast-icon"></td>
  `;
  
  tableBody.appendChild(row);
});

// Event listeners for sorting/filtering the forecast table
document.getElementById('sort-asc').addEventListener('click', () => {
  displaySortedOrFilteredForecast(sortTemperaturesAscending(forecastData));
});

document.getElementById('sort-desc').addEventListener('click', () => {
  displaySortedOrFilteredForecast(sortTemperaturesDescending(forecastData));
});

document.getElementById('filter-rain').addEventListener('click', () => {
  displaySortedOrFilteredForecast(filterRainyDays(forecastData));
});

document.getElementById('highest-temp').addEventListener('click', () => {
  displaySortedOrFilteredForecast([getHighestTemperatureDay(forecastData)]);
});

// DOMContentLoaded event for pop-up functionality
document.addEventListener('DOMContentLoaded', function () {
  const filtersBtn = document.getElementById('wd-filters-btn');
  const popup = document.getElementById('wd-filter-popup');
  const popupOverlay = document.getElementById('wd-popup-overlay');
  const closePopupBtn = document.getElementById('wd-close-popup');

  // Show the filter pop-up
  filtersBtn.addEventListener('click', () => {
    popup.style.display = 'block';
    popupOverlay.style.display = 'block';
  });

  // Close the filter pop-up
  closePopupBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });

  // Close the pop-up when clicking outside of it
  popupOverlay.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });

  // Add functionality to filter buttons (these functions should already exist)
  document.getElementById('sort-asc').addEventListener('click', () => {
    const sortedForecast = sortTemperaturesAscending(forecastData);
    displaySortedOrFilteredForecast(sortedForecast, currentPage);
    popup.style.display = 'none'; // Close popup after clicking
    popupOverlay.style.display = 'none';
  });

  document.getElementById('sort-desc').addEventListener('click', () => {
    const sortedForecast = sortTemperaturesDescending(forecastData);
    displaySortedOrFilteredForecast(sortedForecast, currentPage);
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });

  document.getElementById('filter-rain').addEventListener('click', () => {
    const rainyDaysForecast = filterRainyDays(forecastData);
    displaySortedOrFilteredForecast(rainyDaysForecast, currentPage);
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });

  document.getElementById('highest-temp').addEventListener('click', () => {
    const highestTempDay = [getHighestTemperatureDay(forecastData)];
    displaySortedOrFilteredForecast(highestTempDay, currentPage);
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });
});

const toggleMenuButton = document.getElementById('toggle-menu-button'); // Replace with your actual button ID
const sideMenu = document.querySelector('.side-menu');

toggleMenuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('visible'); // Toggles the class to show/hide the menu
});



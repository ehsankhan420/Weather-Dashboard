// Function to load an external JavaScript file
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback; // Execute callback when the script is loaded
    document.head.appendChild(script);
  }
  
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
  
  document.addEventListener('DOMContentLoaded', function () {
    const filtersBtn = document.getElementById('filters-btn');
    const popup = document.getElementById('filter-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupBtn = document.getElementById('close-popup');
  
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
  
    // Load the app.js script
    loadScript('app.js', () => {
      console.log('app.js loaded successfully');
    });
  });
  
  
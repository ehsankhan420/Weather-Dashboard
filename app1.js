const weatherApiUrl = "https://api.openweathermap.org/data/2.5/";
const weatherApiKey = "714b8773b590a64b6dae03b1852ec05a"; // Your API Key

let currentWeatherData = null;
let isFahrenheit = false;
let tempBarChart, weatherDoughnutChart, tempLineChart;

// Fetch current weather data
async function getWeatherData(city) {
  const spinner = document.getElementById('loading-spinner');
  try {
    // Show spinner
    spinner.classList.remove('hidden');

    const response = await fetch(`${weatherApiUrl}weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    return await response.json();
  } catch (error) {
    alert(error.message);
    return null;
  } finally {
    // Hide spinner
    spinner.classList.add('hidden');
  }
}

// Display current weather
function displayWeather(data) {
  currentWeatherData = data;

  // Set city name and weather details
  document.getElementById('city-name').textContent = data.name;
  document.getElementById('temperature').textContent = `    ${data.main.temp}°C`;
  document.getElementById('weather-description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = `   ${data.main.humidity}%`;
  document.getElementById('wind-speed').textContent = `    ${data.wind.speed} m/s`;

  // Get weather icon code from the API response
  const iconCode = data.weather[0].icon;

  // Construct the URL for the weather icon using the code
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Set the weather icon in the DOM
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.src = iconUrl;
  weatherIcon.alt = data.weather[0].description; // Alt text for the image

  // Error handling if the icon fails to load
  weatherIcon.onerror = function() {
    console.error(`Failed to load weather icon from ${iconUrl}`);
    weatherIcon.src = ''; // Reset the src if the image fails to load
  };

  // Change background based on weather condition
  const weatherCondition = data.weather[0].main.toLowerCase();
  const weatherDescription = data.weather[0].description.toLowerCase();
  const weatherDetails = document.getElementById('weather-details'); // Assuming this is the background container

  switch (weatherCondition) {
    case 'clear':
      if (weatherDescription.includes('sky') || weatherDescription.includes('sunny')) {
        weatherDetails.style.background = "linear-gradient(135deg, #ffdd57, #f9f9f9)"; // Clear Sky/Sunny
      } else {
        weatherDetails.style.background = "linear-gradient(135deg, #ffecb3, #f9f9f9)"; // Generic Clear
      }
      break;
    case 'clouds':
      weatherDetails.style.background = "linear-gradient(135deg, #b0bec5, #f9f9f9)"; // Cloudy
      break;
    case 'rain':
      weatherDetails.style.background = "linear-gradient(135deg, #74b9ff, #f9f9f9)"; // Rainy
      break;
    case 'snow':
      weatherDetails.style.background = "linear-gradient(135deg, #dfe6e9, #f9f9f9)"; // Snowy
      break;
    case 'thunderstorm':
      weatherDetails.style.background = "linear-gradient(135deg, #636e72, #f9f9f9)"; // Thunderstorm
      break;
    case 'drizzle':
      weatherDetails.style.background = "linear-gradient(135deg, #74b9ff, #dfe6e9)"; // Drizzle
      break;
    case 'smoke':
      weatherDetails.style.background = "linear-gradient(135deg, #757575, #f9f9f9)"; // Smoke
      break;
    case 'haze':
      weatherDetails.style.background = "linear-gradient(135deg, #b2bec3, #f9f9f9)"; // Haze
      break;
    case 'mist':
      weatherDetails.style.background = "linear-gradient(135deg, #a4b0be, #f9f9f9)"; // Mist
      break;
    case 'fog':
      weatherDetails.style.background = "linear-gradient(135deg, #dfe6e9, #b2bec3)"; // Fog
      break;
    case 'sand':
    case 'dust':
      weatherDetails.style.background = "linear-gradient(135deg, #e1c699, #f9f9f9)"; // Sand/Dust
      break;
    case 'ash':
      weatherDetails.style.background = "linear-gradient(135deg, #757575, #b2bec3)"; // Ash
      break;
    case 'tornado':
      weatherDetails.style.background = "linear-gradient(135deg, #636e72, #f9f9f9)"; // Tornado
      break;
    default:
      weatherDetails.style.background = "linear-gradient(135deg, #e0f7fa, #f9f9f9)"; // Default/fallback
  }

  // Update charts
  updateCharts(data);
}


// Update the charts with weather data
function updateCharts(data) {
  const temperatureData = [data.main.temp_min, data.main.temp, data.main.temp_max]; // Min, Current, Max temp
  const labels = ['Min Temp', 'Current Temp', 'Max Temp'];

  // Destroy existing charts if they exist to avoid overlap
  if (tempBarChart) tempBarChart.destroy();
  if (weatherDoughnutChart) weatherDoughnutChart.destroy();
  if (tempLineChart) tempLineChart.destroy();

  // Bar chart (Temperature comparison)
// Enhanced Bar Chart (Temperature Data)
const tempBarChartCtx = document.getElementById('temp-bar-chart').getContext('2d');
tempBarChart = new Chart(tempBarChartCtx, {
  type: 'bar',
  data: {
    labels: ['Min Temp (°C)', 'Current Temp (°C)', 'Max Temp (°C)', 'Feels Like (°C)', 'Dew Point (°C)'], // Added more labels
    datasets: [{
      label: 'Temperature (°C)',
      data: [data.main.temp_min, data.main.temp, data.main.temp_max, data.main.feels_like, data.main.temp - 5], // Added "Feels Like" and Dew Point (dummy data for dew point)
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',  // Min Temp (Light Blue)
        'rgba(255, 159, 64, 0.6)',  // Current Temp (Orange)
        'rgba(153, 102, 255, 0.6)', // Max Temp (Purple)
        'rgba(54, 162, 235, 0.6)',  // Feels Like (Blue)
        'rgba(255, 206, 86, 0.6)'   // Dew Point (Yellow)
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 2, // Thicker border for more defined bars
      hoverBackgroundColor: [
        'rgba(75, 192, 192, 0.9)',
        'rgba(255, 159, 64, 0.9)',
        'rgba(153, 102, 255, 0.9)',
        'rgba(54, 162, 235, 0.9)',
        'rgba(255, 206, 86, 0.9)'
      ], // Darken color on hover
      hoverBorderColor: 'rgba(0, 0, 0, 0.8)' // Add a dark border on hover for better effect
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + '°C'; // Add unit to y-axis labels
          },
          color: '#333', // y-axis label color
          font: {
            size: 12,
            family: 'Arial'
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)' // Light grid lines
        }
      },
      x: {
        ticks: {
          color: '#333', // x-axis label color
          font: {
            size: 12,
            family: 'Arial'
          }
        },
        grid: {
          display: false // Hide x-axis grid lines for a cleaner look
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial',
            style: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 5,
        caretSize: 6
      }
    },
    responsive: true,
    animation: {
      duration: 1000, // Smooth animation
      easing: 'easeOutBounce' // Bounce effect for added style
    }
  }
});

  // Doughnut chart (Humidity vs Wind Speed)
// Enhanced Doughnut Chart (Humidity, Wind Speed, Weather Conditions)
const weatherDoughnutChartCtx = document.getElementById('weather-doughnut-chart').getContext('2d');
weatherDoughnutChart = new Chart(weatherDoughnutChartCtx, {
  type: 'doughnut',
  data: {
    labels: ['Humidity (%)', 'Wind Speed (m/s)', 'Clouds (%)', 'Rain (mm)', 'Pressure (hPa)', 'Visibility (m)'],
    datasets: [{
      data: [
        data.main.humidity,          // Humidity percentage
        data.wind.speed,             // Wind speed in m/s
        data.clouds.all,             // Cloudiness percentage
        data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0, // Rain volume in mm (if available)
        data.main.pressure,          // Atmospheric pressure in hPa
        data.visibility / 1000       // Visibility in kilometers
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',  // Humidity (Light Blue)
        'rgba(255, 99, 132, 0.6)',  // Wind Speed (Red)
        'rgba(255, 206, 86, 0.6)',  // Clouds (Yellow)
        'rgba(54, 162, 235, 0.6)',  // Rain (Blue)
        'rgba(153, 102, 255, 0.6)', // Pressure (Purple)
        'rgba(255, 159, 64, 0.6)'   // Visibility (Orange)
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 8 // Increase hover effect
    }]
  },
  options: {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',  // Legend text color
          font: {
            size: 14,
            family: 'Arial',
            style: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for tooltips
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 5,
        caretSize: 6
      }
    },
    cutout: '50%',  // More space inside the doughnut
    rotation: -90,  // Start angle at the top
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
});

  // Line chart (Temperature over time - Dummy Data)
  const tempLineChartCtx = document.getElementById('temp-line-chart').getContext('2d');
  tempLineChart = new Chart(tempLineChartCtx, {
    type: 'line',
    data: {
      labels: ['Morning', 'Afternoon', 'Evening', 'Night'], // Dummy times of day
      datasets: [{
        label: 'Temperature (°C)',
        data: [data.main.temp - 2, data.main.temp, data.main.temp - 1, data.main.temp - 3], // Dummy data
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(temp) {
  return (temp * 9 / 5) + 32;
}

function updateWeatherUnit() {
  const temperature = isFahrenheit ? celsiusToFahrenheit(currentWeatherData.main.temp) : currentWeatherData.main.temp;
  document.getElementById('temperature').textContent = `Temperature: ${temperature}°${isFahrenheit ? 'F' : 'C'}`;
}

document.getElementById('unit-toggle').addEventListener('change', (event) => {
  isFahrenheit = event.target.checked;
  updateWeatherUnit();
});

// Fetch weather on button click
document.getElementById('get-weather').addEventListener('click', async () => {
  const city = document.getElementById('city-input').value;

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const weatherData = await getWeatherData(city);
  if (weatherData) {
    displayWeather(weatherData);
  }
});

// Geolocation API to get the user's location
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Function called on successful location retrieval
function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  
  // Fetch weather for the user's location
  fetchWeatherByCoords(latitude, longitude);
}

// Function called on location retrieval error
function error() {
  alert("Unable to retrieve your location. Please enter a city manually.");
}

// Function to fetch weather by geographic coordinates
function fetchWeatherByCoords(lat, lon) {
  const apiKey = "714b8773b590a64b6dae03b1852ec05a"; // Replace with your OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => console.log("Error fetching weather data:", error));
}

// Detect user's location on button click
document.getElementById('get-location').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Fetch weather data for current location
      const weatherData = await getWeatherDataByCoords(lat, lon);
      if (weatherData) {
        displayWeather(weatherData);
      }
    }, () => {
      alert("Unable to retrieve your location. Please try again.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

async function getWeatherDataByCoords(lat, lon) {
  const spinner = document.getElementById('loading-spinner');
  try {
    spinner.classList.remove('hidden'); // Show spinner

    const response = await fetch(`${weatherApiUrl}weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
    if (!response.ok) throw new Error('Unable to fetch weather data');
    return await response.json();
  } catch (error) {
    alert(error.message);
    return null;
  } finally {
    spinner.classList.add('hidden'); // Hide spinner
  }
}

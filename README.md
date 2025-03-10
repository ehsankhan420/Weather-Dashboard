# Weather Dashboard App

## Overview
The **Weather Dashboard App** is a fully responsive web application built using HTML, CSS, and JavaScript. It integrates the **OpenWeather API** for real-time weather data and the **Gemini API** for chatbot interactions. The app displays current weather conditions and a 5-day weather forecast with dynamic visualizations.

Additionally, users can upload a profile picture and customize their profile. The app features animations for charts, chatbot interactions, buttons, and menus. It has a sleek color theme of black, grey, blue, and white, with a dynamically changing weather widget based on real-time conditions.

## Key Features
### 🌦️ Weather Data Integration:
- Fetches real-time weather using the **OpenWeather API**.
- Displays current weather conditions, temperature, humidity, wind speed, and more.
- The background of the weather widget adapts dynamically based on the weather (e.g., cloudy, sunny, rainy).

### 📊 Data Visualization:
- Integrated with **Chart.js** for visual representations:
  - **Vertical Bar Chart**: 5-day temperature forecast.
  - **Doughnut Chart**: Breakdown of weather conditions over the 5-day period.
  - **Line Chart**: Temperature trends over the next 5 days.
- Animations such as delay and drop effects enhance user experience.

### 🤖 Chatbot Integration:
- Uses the **Gemini API** for chatbot functionality.
- Provides weather-related answers based on user queries.
- Handles general queries via the chatbot API.

### 👤 User Profile:
- Users can upload a profile picture from their device and save it.
- Profile information can be viewed and edited.

### 🔍 Filters and Sorting:
- Sort temperatures in ascending or descending order.
- Filter out days without rain.
- Highlight the day with the highest temperature.

### 📄 Pagination:
- Implements pagination for the forecast table, displaying 10 entries per page.

### 📱 Responsive Design:
- Fully responsive across all devices for seamless user experience.

### ⚙️ Additional Features:
- Toggle temperature units between Celsius and Fahrenheit.
- Geolocation support to detect the user's location for displaying relevant weather.
- Loading spinner while fetching API data.

## How It Works
### Weather Data Fetching
Users input a city name, and the app fetches current weather and a 5-day forecast using the **OpenWeather API**. Weather data is dynamically displayed on the dashboard.

### User Profile Management
Users can upload a profile picture from their local machine, and view or update their profile information.

### Chatbot
Integrated with the **Gemini API**, the chatbot provides weather-related responses and handles non-weather queries.

### Visualizations
Three types of animated charts (Vertical Bar, Doughnut, and Line) showcase weather trends and data for the next 5 days.

## Tech Stack
- **HTML/CSS**: For layout, styling, and responsive design.
- **JavaScript**: For API interactions and dynamic content rendering.
- **OpenWeather API**: For real-time weather data.
- **Gemini API**: For chatbot interactions.
- **Chart.js**: For data visualizations.

## Setup Instructions
1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/weather-dashboard-app.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd weather-dashboard-app
    ```
3. **Open `index.html` in your browser** to run the application.

### Set up OpenWeather API:
- Sign up at **[OpenWeather](https://openweathermap.org/)**.
- Retrieve your API key and replace the placeholder in the JavaScript file.

### Set up Gemini API:
- Sign up at **[Google AI Gemini](https://developers.google.com/gemini)**.
- Obtain your API key and replace the placeholder in the chatbot script.

Run the app and explore all the features!

## Known Issues
- **API Rate Limit**: The OpenWeather free plan restricts you to 60 API calls per minute. Be mindful of this when making requests.
- **Latency**: Some API calls may experience delays due to external server traffic.

## Future Enhancements
- Improve the chatbot conversation flow for more natural interaction.
- Add additional weather filters such as humidity and wind speed.
Updated project documentation

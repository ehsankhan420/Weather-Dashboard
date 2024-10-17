document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const openChatButton = document.getElementById('open-chat');
    const chatMessages = document.getElementById('chat-messages');

    const weatherApiKey = '714b8773b590a64b6dae03b1852ec05a'; // Replace with your weather API key
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // OpenWeatherMap API URL
    
    const geminiApiKey = 'AIzaSyDqTbnaMXyMSTT5b8-AAGXY6MwgYo5Cql8'; // Replace with your Gemini API key

    // Function to fetch weather
    async function getWeather(city) {
        try {
            const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${weatherApiKey}&units=metric`);
            const data = await response.json();
            
            if (data.cod === 200) {
                return {
                    city: data.name,
                    temperature: data.main.temp,
                    condition: data.weather[0].description,
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    windSpeed: data.wind.speed
                };
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    // Fetch response from Gemini API using user input
    async function fetchGeminiAnswer(userInput) {
        const apiKey = geminiApiKey;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
        if (!userInput || userInput.trim() === '') {
            return "Error: Input is empty.";
        }
    
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: userInput
                        }
                    ]
                }
            ]
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                const errorDetails = await response.json(); 
                console.error('Gemini API Error:', errorDetails);
                throw new Error(`Gemini API Error: ${response.statusText}`);
            }
            
            const data = await response.json();
    
            if (data?.candidates?.length > 0) {
                const generatedContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response found in expected format";
                return generatedContent;
            } else {
                throw new Error('Received no candidates from Gemini.');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "There was an error generating content";
        }
    }

    // Extract city name from user input by removing weather details
    function extractCityName(userMessage) {
        const cityMatch = userMessage.match(/(?:weather|temperature|humidity|pressure|wind speed|forecast)\s*(in|for|at|of)?\s*([a-zA-Z\s]+)/i);
        if (cityMatch && cityMatch[2]) {
            return cityMatch[2].trim();
        }
        return userMessage.trim();
    }
  
    // Detect specific weather details in user input
    function detectWeatherDetail(userMessage) {
        if (userMessage.includes('temperature')) {
            return 'temperature';
        } else if (userMessage.includes('humidity')) {
            return 'humidity';
        } else if (userMessage.includes('pressure')) {
            return 'pressure';
        } else if (userMessage.includes('wind speed')) {
            return 'windSpeed';
        } else {
            return 'general';
        }
    }
  
    // Check if the query is related to weather
    function isWeatherQuery(userMessage) {
        return /(weather|temperature|humidity|pressure|wind speed|forecast)/i.test(userMessage);
    }

    // Toggle chatbot visibility on open button click
    openChatButton.addEventListener('click', () => {
        chatbotContainer.classList.toggle('hidden');
    });

    // Close chatbot when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!chatbotContainer.contains(event.target) && !openChatButton.contains(event.target)) {
            chatbotContainer.classList.add('hidden');
        }
    });

    // Prevent chatbot from closing when clicking inside it
    chatbotContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Handle chatbot submission
    async function handleChatSubmit() {
        const userMessage = chatInput.value.trim();

        if (userMessage) {
            displayMessage(`You: ${userMessage}`, 'user');

            // Show typing indicator after user input
            showTypingIndicator();

            if (isWeatherQuery(userMessage)) {
                const city = extractCityName(userMessage);
                const weatherDetail = detectWeatherDetail(userMessage);
                const weatherData = await getWeather(city);

                // Hide typing indicator once the bot responds
                hideTypingIndicator();

                if (weatherData) {
                    let weatherResponse = '';
                    switch (weatherDetail) {
                        case 'temperature':
                            weatherResponse = `The temperature in ${weatherData.city} is ${weatherData.temperature}°C.`;
                            break;
                        case 'humidity':
                            weatherResponse = `The humidity in ${weatherData.city} is ${weatherData.humidity}%.`;
                            break;
                        case 'pressure':
                            weatherResponse = `The air pressure in ${weatherData.city} is ${weatherData.pressure} hPa.`;
                            break;
                        case 'windSpeed':
                            weatherResponse = `The wind speed in ${weatherData.city} is ${weatherData.windSpeed} m/s.`;
                            break;
                        default:
                            weatherResponse = `The weather in ${weatherData.city} is ${weatherData.condition} with a temperature of ${weatherData.temperature}°C, humidity of ${weatherData.humidity}%, and wind speed of ${weatherData.windSpeed} m/s.`;
                    }
                    displayMessage(`Bot: ${weatherResponse}`, 'bot');
                } else {
                    displayMessage(`Bot: Sorry, I couldn't find weather information for ${city}.`, 'bot');
                }
            } else {
                const geminiResponse = await fetchGeminiAnswer(userMessage);

                // Hide typing indicator once the bot responds
                hideTypingIndicator();

                displayMessage(`Bot: ${geminiResponse}`, 'bot');
            }

            chatInput.value = '';
        }
    }

    // Listen for the Enter key press to submit the message
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default newline action
            handleChatSubmit();     // Call the submit function
        }
    });

    // Listen for click event on the submit button
    chatSubmit.addEventListener('click', handleChatSubmit);

    // Display message in chatbot
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `item ${sender === 'user' ? 'right' : ''}`;
        
        // Add avatar and message bubble
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.innerHTML = sender === 'user' ? 'U' : 'B'; // Placeholder initials for user and bot

        const messageDiv = document.createElement('div');
        messageDiv.className = 'msg';
        messageDiv.innerHTML = `<p>${message}</p>`;

        messageElement.appendChild(iconDiv);
        messageElement.appendChild(messageDiv);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    }
});

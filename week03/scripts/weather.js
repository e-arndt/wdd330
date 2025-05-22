console.log("Weather.js is loaded successfully!");

async function getWeather(city) {
    // const apiKey = "f1999393ce294ea3bf8185645252005";
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        console.log(`Current weather in ${data.location.name}, ${data.location.country}:`);
        console.log(`- Condition: ${data.current.condition.text}`);
        console.log(`- Temperature: ${data.current.temp_c}°C / ${data.current.temp_f}°F`);
        console.log(`- Humidity: ${data.current.humidity}%`);
        console.log(`- Wind: ${data.current.wind_kph} kph (${data.current.wind_dir})`);

        document.getElementById("weather-data").innerHTML = `
            <h2>Weather in ${data.location.name}, ${data.location.country}</h2>
            <p>Condition: ${data.current.condition.text}</p>
            <p>Temperature: ${data.current.temp_c}°C / ${data.current.temp_f}°F</p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph (${data.current.wind_dir})</p>
            <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weather-data").textContent = "Failed to fetch weather data.";
    }
}

getWeather("Tokyo");


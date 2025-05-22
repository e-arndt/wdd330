console.log("location.js is loaded!");

let startData, endData;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCachedCity(cityKey, selectedCity) {
    const cachedData = localStorage.getItem(cityKey);
    if (!cachedData) {
        return null; // ✅ Avoids trying to parse undefined data
    }

    const parsedData = JSON.parse(cachedData);
    if (!parsedData?.data?.length) { // ✅ Ensures parsedData.data exists
        return null;
    }

    if (parsedData.data.some(city => city.city === selectedCity)) {
        return parsedData;
    }

    return null;
}




// Haversine formula for calculating distance between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth’s radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

async function getLocationData() {
    const apiKey = "2f3e9979b7mshdc0da415a1c7fdcp1c71ffjsn4d8ada5f3148";
    const startCity = document.getElementById("start-location").value.trim();
    const endCity = document.getElementById("end-location").value.trim();

    
    const startCountry = document.getElementById("start-country").value.trim();
    const endCountry = document.getElementById("end-country").value.trim();

    const baseUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";

    console.log("Entered Start City:", startCity);
    console.log("Entered Start Country:", startCountry);
    console.log("Entered End City:", endCity);
    console.log("Entered End Country:", endCountry);

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
        }
    };

    startData = getCachedCity(startCity);
    endData = getCachedCity(endCity);

    if (startData) {
        console.log(`Using cached data for Start City: ${startCity}`);
    }
    if (endData) {
        console.log(`Using cached data for End City: ${endCity}`);
    }

    try {
        document.getElementById("location-info").textContent = "Fetching city data...";

        
        if (!startData) {
            console.log(`Fetching Start City Data from: ${baseUrl}?namePrefix=${startCity}&countryIds=${startCountry}`);
            const startRes = await fetch(`${baseUrl}?namePrefix=${startCity}&countryIds=${startCountry}`, options);
            startData = await startRes.json();
            localStorage.setItem(startCity, JSON.stringify(startData));
        }

        if (!endData) {
            console.log(`Fetching End City Data from: ${baseUrl}?namePrefix=${endCity}&countryIds=${endCountry}`);
            await delay(1100);
            const endRes = await fetch(`${baseUrl}?namePrefix=${endCity}&countryIds=${endCountry}`, options);
            endData = await endRes.json();
            localStorage.setItem(endCity, JSON.stringify(endData));
        }

        


        console.log("Available Start Cities:", startData.data.map(city => city.city));
        console.log("Available End Cities:", endData.data.map(city => city.city));

        if (!startData?.data?.length || !endData?.data?.length) {
            document.getElementById("location-info").textContent = "City not found. Please check your spelling and try again.";
            return;
        }

        const startOptions = startData.data.map(city => `<option value="${city.city}">${city.city} (${city.country})</option>`).join('');
        const endOptions = endData.data.map(city => `<option value="${city.city}">${city.city} (${city.country})</option>`).join('');

        const start = startData.data.find(city => city.city.toLowerCase().includes(startCity.toLowerCase()));
        const end = endData.data.find(city => city.city.toLowerCase().includes(endCity.toLowerCase()));


        if (!start || !end) {
            document.getElementById("location-info").textContent = "Could not find one or both cities. Please check spelling or try another city.";
            return;
        }
        

        console.log("Start City Data:", start);
        console.log("End City Data:", end);

        // Calculate distance using Haversine formula
        const distanceKm = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
        const distanceMiles = distanceKm * 0.621371; // Convert KM to miles
        console.log(`Calculated Distance: ${distanceKm.toFixed(2)} km (${distanceMiles.toFixed(2)} miles)`);


        if (startData.data.length > 1 || endData.data.length > 1) {
            document.getElementById("location-info").innerHTML = `
                <label for="start-select">Select Start City:</label>
                <select id="start-select">${startOptions}</select>
                <label for="end-select">Select End City:</label>
                <select id="end-select">${endOptions}</select>
                <button onclick="confirmCitySelection()">Confirm Selection</button>`;
                
        } else {
            confirmCitySelection(); // If only one match, auto-confirm selection
        }
            

    } catch (error) {
        console.error("Error fetching location data:", error);
        document.getElementById("location-info").textContent = "Failed to fetch location data.";
    }
}

async function confirmCitySelection() {
    let startCitySelected, endCitySelected;

    if (document.getElementById("start-select")) {
        startCitySelected = document.getElementById("start-select").value;
        endCitySelected = document.getElementById("end-select").value;
    } else {
        startCitySelected = startData?.data?.[0]?.city;
        endCitySelected = endData?.data?.[0]?.city;
    }

    console.log("User Selected Start City:", startCitySelected);
    console.log("User Selected End City:", endCitySelected);

    if (!startCitySelected || !endCitySelected) {
        console.error("Error: No valid city found for selection.");
        document.getElementById("location-info").textContent = "Error: Could not automatically select cities. Please try a different city.";
        return;
    }

    console.log("User Selected Start City:", startCitySelected);
    console.log("User Selected End City:", endCitySelected);

    const start = startData.data.find(city => city.city.toLowerCase() === startCitySelected.toLowerCase());
    const end = endData.data.find(city => city.city.toLowerCase() === endCitySelected.toLowerCase());

    if (!start || !end) {
        console.error(`Error: Missing city data—Start: ${startCitySelected}, End: ${endCitySelected}`);
        document.getElementById("location-info").textContent = "Error: City data could not be found. Please check your input.";
        return;
    }

    const startRegion = await getCityRegion(start.wikiDataId);
    const endRegion = await getCityRegion(end.wikiDataId);

    console.log(`Final Start City: ${start.city}, ${startRegion}`);
    console.log(`Final End City: ${end.city}, ${endRegion}`);


    if (!startData?.data?.length || !endData?.data?.length || !start || !end) {
        console.error(`Error: Missing city data—Start: ${startCitySelected}, End: ${endCitySelected}`);
        document.getElementById("location-info").textContent = "Error: City data could not be found. Please check your input.";
        return;
    }
    
    console.log("Start City Data:", start);
    console.log("End City Data:", end);


    const distanceKm = calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
    const distanceMiles = distanceKm * 0.621371;

    document.getElementById("location-info").innerHTML = `
        <h2>Distance from ${start.city} to ${end.city}: ${distanceKm.toFixed(2)} km (${distanceMiles.toFixed(2)} miles)</h2>
        <p>Population: ${end.population.toLocaleString()}</p>
        <p>Region: ${end.region}</p>
        <img src="https://flagsapi.com/${end.countryCode}/flat/64.png" alt="${end.country} flag">`;
}


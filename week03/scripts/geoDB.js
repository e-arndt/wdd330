async function testGeoDB() {
    const apiKey = "2f3e9979b7mshdc0da415a1c7fdcp1c71ffjsn4d8ada5f3148"; // Your API key
    const url = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=Tokyo";

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log("City Data:", data);
    } catch (error) {
        console.error("Error fetching city data:", error);
    }
}

testGeoDB();

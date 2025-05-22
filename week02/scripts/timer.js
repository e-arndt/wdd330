function startCountdown() {
    let countdownElement = document.getElementById("countdown");

    // Remove any existing template content
    let existingContent = document.querySelectorAll("h2, img"); // Selects both
    existingContent.forEach(element => element.remove()); // Removes all found elements

    let startTimer = 10;

    let interval = setInterval(() => {
        countdownElement.textContent = `Countdown: ${startTimer}`;
        startTimer--;

        if (startTimer < 0) {
            clearInterval(interval);
            showContent(); // Call function to show template
        }
    }, 1000);
}

function showContent() {
    let temp = document.getElementsByTagName("template")[0];
    let clon = temp.content.cloneNode(true);

    document.body.appendChild(clon);

    // Add fade-in effect after insertion
    setTimeout(() => {
        let img = document.querySelector("img");
        img.style.opacity = "1"; // Make image visible
    }, 100);
}

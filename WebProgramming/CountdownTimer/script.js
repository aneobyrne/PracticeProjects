/*async function countdown() {
  for (let i = 25; i >= 0; i--) {
    console.log(i);
    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
  }
  console.log("Countdown complete!");
}

countdown(); */

// Get references to elements in the HTML
const startBtn = document.getElementById("startBtn");
const input = document.getElementById("startNumber");
const output = document.getElementById("output");

// Helper function: wait for a given number of milliseconds
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Countdown function (async so we can use 'await')
async function countdown(from) {
  output.innerHTML = ""; // Clear old output

  for (let i = from; i >= 0; i--) {
    output.innerHTML = `<p>${i}</p>`;
    await wait(1000); // Wait 1 second before the next number
  }

  output.innerHTML = `<p>Countdown complete!</p>`;

  // Ask the user if they want to start again
  const restart = confirm("Countdown complete! Do you want to start again?");
  if (restart) {
    input.value = "";
    output.innerHTML = "";
  }
}

// When the Start button is clicked
startBtn.addEventListener("click", () => {
  const num = parseInt(input.value);

  if (isNaN(num) || num < 0) {
    alert("Please enter a valid non-negative number!");
    return;
  }

  countdown(num);
});

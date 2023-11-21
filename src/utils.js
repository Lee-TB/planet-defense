// Function to format minutes, adding a leading zero if the minutes are below 10
export function formatMinutes(minutes) {
  // Convert to an integer
  minutes = parseInt(minutes);

  // Check if the minutes are below 10
  if (minutes < 10) {
    // Add a leading zero and convert to a string
    return "0" + minutes.toString();
  } else {
    // Return the minutes unchanged if 10 or greater
    return minutes.toString();
  }
}

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

export function drawStartScreen(ctx, canvas) {
  ctx.save();
  ctx.drawImage(background, 0, 0, 800, 800, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    planet,
    canvas.width * 0.5 - 200 * 0.6 * 0.5 * canvas.scale,
    canvas.height * 0.5 - 200 * 0.6 * 0.5 * canvas.scale,
    200 * canvas.scale * 0.6,
    200 * canvas.scale * 0.6
  );

  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = `${48 * canvas.scale}px Impact`;
  ctx.fillText("Planet Defense", canvas.width / 2, canvas.height / 3);

  ctx.font = `${32 * canvas.scale}px Consolas`;
  ctx.fillStyle = "black";
  ctx.fillText(
    "Press enter to play game",
    canvas.width / 2 - 2,
    canvas.height / 2 + 100
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    "Press enter to play game",
    canvas.width / 2,
    canvas.height / 2 + 102
  );
  ctx.restore();
}

import { mobileCheck } from "./detect-mobile-browser.js";

// Function to format minutes, adding a leading zero if the minutes are below 10
export function formatMinutes(minutes) {
  minutes = parseInt(minutes);

  if (minutes < 10) {
    return "0" + minutes.toString();
  } else {
    return minutes.toString();
  }
}

export function drawStartScreen(ctx, canvas) {
  const desktopMessage = "Press enter to play game";
  const mobileMessage = "Swipe to play game";
  const isMobile = mobileCheck();
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
  ctx.fillStyle = "#445D48";
  ctx.font = `${48 * canvas.scale}px Impact`;
  ctx.fillText("Planet Defense", canvas.width / 2, canvas.height / 3);
  ctx.fillStyle = "#D2DE32";
  ctx.fillText("Planet Defense", canvas.width / 2 + 2, canvas.height / 3 + 2);

  ctx.font = `${32 * canvas.scale}px Consolas`;
  ctx.fillStyle = "black";
  ctx.fillText(
    isMobile ? mobileMessage : desktopMessage,
    canvas.width / 2 - 2,
    canvas.height / 2 + 100
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    isMobile ? mobileMessage : desktopMessage,
    canvas.width / 2,
    canvas.height / 2 + 102
  );
  ctx.restore();
}

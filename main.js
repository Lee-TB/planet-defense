import { Game } from "./src/game.js";
import { drawStartScreen } from "./src/utils.js";

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  const scale = Math.min(800, window.innerWidth, window.innerHeight) / 800;
  canvas.scale = scale;
  canvas.width = 800 * canvas.scale;
  canvas.height = 800 * canvas.scale;

  const game = new Game(canvas);

  let requestID;
  let lastTime = 0;
  let playGame = false;
  let pauseGame = true;

  function animate(timeStamp = 0) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    
    if(!playGame) drawStartScreen(ctx, canvas);
    if (playGame && !pauseGame) game.render(ctx, deltaTime);

    requestID = window.requestAnimationFrame(animate);
  }
  requestID = window.requestAnimationFrame(animate);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      playGame = true;
      pauseGame = false;
    }
    
    if(e.key === "Escape" && playGame) {
      pauseGame = !pauseGame;
    }    
  });
});

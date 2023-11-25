import { Game } from "./src/game.js";
import { drawStartScreen } from "./src/utils.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const settingsButton = document.getElementById("settingsButton");
  const settingsMenu = document.getElementById("settingsMenu");
  const resumeButton = document.getElementById("resumeButton");
  const restartButton = document.getElementById("restartButton");
  const soundEffectVolume = document.getElementById("soundEffectVolume");
  const musicVolume = document.getElementById("musicVolume");

  const scale = Math.min(800, window.innerWidth, window.innerHeight) / 800;
  canvas.scale = scale;
  canvas.width = 800 * canvas.scale;
  canvas.height = 800 * canvas.scale;

  let game = new Game(canvas);

  let requestID;
  let lastTime = 0;

  function animate(timeStamp = 0) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (!game.start) drawStartScreen(ctx, canvas);
    if (game.start) {
      if (game.pause) {
        settingsMenu.style.display = "block";
        settingsButton.style.display = "none";
      } else {
        game.render(ctx, deltaTime);
        settingsMenu.style.display = "none";
        settingsButton.style.display = "block";
      }

      if (game.gameOver) {
        settingsMenu.style.display = "block";
        settingsButton.style.display = "none";
      }
    }

    requestID = window.requestAnimationFrame(animate);
  }
  requestID = window.requestAnimationFrame(animate);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      game.start = true;
      game.pause = false;
      game.music.play();
    }

    if (e.key === "Escape" && game.start) {
      game.pause = !game.pause;
    }
  });

  settingsButton.addEventListener("click", () => {
    game.pause = true;
  });

  resumeButton.addEventListener("click", () => {
    game.pause = false;
  });

  restartButton.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to restart game now?")) {
      game.music.load();
      game = new Game(canvas);
      settingsMenu.style.display = "none";
      settingsButton.style.display = "none";
    }
  });

  soundEffectVolume.addEventListener("change", (e) => {
    game.setSoundVolume(e.target.value);
  });

  musicVolume.addEventListener("input", (e) => {
    game.setMusicVolume(e.target.value);
  });
});

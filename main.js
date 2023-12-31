import { Game } from "./src/game.js";
import { Menu } from "./src/menu.js";
import { drawStartScreen } from "./src/utils.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  const scale = Math.min(800, window.innerWidth, window.innerHeight) / 800;
  canvas.scale = scale;
  canvas.width = 800 * canvas.scale;
  canvas.height = 800 * canvas.scale;

  let game = new Game(canvas);
  const menu = Menu.getInstance();
  menu.setGame(game);

  let lastTime = 0;
  function animate(timeStamp = 0) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (!game.start) drawStartScreen(ctx, canvas);
    if (game.start) {
      if (game.pause) {
        menu.open();
      } else {
        game.render(ctx, deltaTime);
        menu.close();
      }

      if (game.gameOver) {
        menu.openGameOverMenu();
      }
    }

    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      game.start = true;
      game.pause = false;
      game.playMusic();
    }

    if (e.key === "Escape" && game.start) {
      game.pause = !game.pause;
    }
  });

  let startX, startY;
  let starteSwiping = false;
  if (game.isMobile) {
    window.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    window.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (!starteSwiping && Math.hypot(dx, dy) > 100) {
        starteSwiping = true;
        game.start = true;
        game.pause = false;
        game.playMusic();
        game.autoShoot = true;
        menu.autoShootSwitch.checked = true;
      }
    });
  }

  menu.onRestartGame(() => {
    starteSwiping = false;
    game = new Game(canvas);
    return game;
  });
});

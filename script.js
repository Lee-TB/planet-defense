class Player {
  constructor(game) {
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = this.game.height * 0.5;
    this.radius = 40 * this.game.scale;
    this.image = document.getElementById("player");
    this.aim;
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.stroke();
  }
  update() {
    this.aim = this.game.calcAim(this.game.mouse, this.game.planet);
    this.x =
      this.game.planet.x +
      (this.game.planet.radius + this.radius) * this.aim.aimX;
    this.y =
      this.game.planet.y +
      (this.game.planet.radius + this.radius) * this.aim.aimY;
  }
}

class Planet {
  constructor(game) {
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = this.game.height * 0.5;
    this.radius = 100 * this.game.scale;
    this.image = document.getElementById("planet");
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    context.strokeStyle = "red";
    context.beginPath();
    context.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
    context.stroke();
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.scale = this.canvas.scale;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.planet = new Planet(this);
    this.player = new Player(this);

    this.mouse = {
      x: 0,
      y: 0,
    };
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
  }

  render(context) {
    this.planet.draw(context);
    this.player.draw(context);
    this.player.update();

    context.beginPath();
    context.moveTo(this.planet.x, this.planet.y);
    context.lineTo(this.mouse.x, this.mouse.y);
    context.stroke();
  }

  calcAim(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const aimX = dx / distance;
    const aimY = dy / distance;
    return { aimX, aimY, dx, dy };
  }
}

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  const scale = Math.min(800, window.innerWidth, window.innerHeight) / 800;
  canvas.scale = scale;
  canvas.width = 800 * canvas.scale;
  canvas.height = 800 * canvas.scale;

  const game = new Game(canvas);

  let requestID;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestID = window.requestAnimationFrame(animate);
  }
  requestID = window.requestAnimationFrame(animate);
});

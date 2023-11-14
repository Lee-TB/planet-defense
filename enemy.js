export class Enemy {
  constructor(game) {
    this.game = game;
    this.radius = 40 * this.game.scale;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.x;
    this.y;
    this.speedX;
    this.speedY;
    this.free = true;
  }

  start() {
    this.free = false;
    this.x = Math.random() * this.game.width;
    this.y = Math.random() * this.game.height;
    const aim = this.game.calcAim(this, this.game.planet)
    this.speedX = -aim.aimX;
    this.speedY = -aim.aimY;
  }

  reset() {
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      if(this.game.debug) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = "red";
        context.stroke();
        context.restore();
      }
    }
  }

  update() {
    if (!this.free) {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    // reset if it collide with planet or player
    if (
      this.game.checkCollision(this, this.game.planet) ||
      this.game.checkCollision(this, this.game.player)
    ) {
      this.reset();
    }
  }
}

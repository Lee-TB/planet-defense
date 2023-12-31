export class Projectile {
  constructor(game) {
    this.game = game;
    this.x;
    this.y;
    this.aimX;
    this.aimY;
    this.speedX;
    this.speedY;

    this.speedModifier = 10;
    this.radius = 4 * this.game.scale;
    this.free = true;
  }

  start(x, y, aimX, aimY) {
    this.free = false;
    this.x = x;
    this.y = y;
    this.aimX = aimX;
    this.aimY = aimY;
    this.speedX = this.aimX * this.speedModifier * this.game.speedModifier;
    this.speedY = this.aimY * this.speedModifier * this.game.speedModifier;
  }

  reset() {
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = "gold";
      context.fill();
      context.restore();
    }
  }

  update() {
    if (!this.free) {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    // reset projectile if it move outside the visible game area.
    if (
      this.x < 0 ||
      this.x > this.game.width ||
      this.y < 0 ||
      this.y > this.game.height
    ) {
      this.reset();
    }
  }
}

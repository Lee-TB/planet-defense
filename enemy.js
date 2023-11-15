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
    if (Math.random() < 0.5) {
      this.x = Math.random() * this.game.width;
      this.y = Math.random() < 0.5 ? 0 - this.height : this.game.height;
    } else {
      this.x = Math.random() < 0.5 ? 0 - this.width : this.game.width;
      this.y = Math.random() * this.game.height;
    }
    const aim = this.game.calcAim(this, this.game.planet);
    this.speedX = -aim.aimX;
    this.speedY = -aim.aimY;
  }

  reset() {
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      if (this.game.debug) {
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

    // check collision enemy / planet
    if (this.game.checkCollision(this, this.game.planet)) {
      this.reset();
    }

    // check collision enemy / player
    if (this.game.checkCollision(this, this.game.player)) {
      this.reset();
    }

    // check collision enemy / projectile
    this.game.projectilePool.forEach((projectile) => {
      if(!projectile.free && this.game.checkCollision(this, projectile)) {
        projectile.reset()
      }
    });
  }
}

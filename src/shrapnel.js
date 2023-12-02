export class Shrapnel {
  x;
  y;
  speedX;
  speedY;
  radius;
  free;
  speedModifier;

  constructor(game) {
    this.game = game;
    this.free = true;
    this.speedModifier = 5;
  }

  start(x, y, projectileAimX, projectileAimY, projectileRadius) {
    this.free = false;
    this.x = x;
    this.y = y;
    this.radius = projectileRadius * Math.random() * 0.5 + 0.5;

    const { angleX, angleY } = this.getRandomAngle(
      projectileAimX,
      projectileAimY
    );
    const randomSpeed = Math.random() + 0.5;
    this.speedX =
      angleX * randomSpeed * this.speedModifier * this.game.speedModifier;
    this.speedY =
      angleY * randomSpeed * this.speedModifier * this.game.speedModifier;
  }

  reset() {
    this.free = true;
  }

  draw(context) {
    if (!this.free) {
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = Math.random() < 0.5 ? "gold" : "white";
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

  getRandomAngle(aimX, aimY) {
    const angle = Math.atan2(aimY, aimX);
    const angleRange = Math.PI;
    const randomAngle = Math.random() * angleRange - angleRange / 2;
    const angleX = Math.cos(angle + randomAngle);
    const angleY = Math.sin(angle + randomAngle);
    return { angleX, angleY };
  }
}

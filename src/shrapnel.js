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

  start(x, y, projectileRadius) {
    this.free = false;
    this.x = x;
    this.y = y;
    this.radius = projectileRadius * Math.random() * 0.5 + 0.5;
    const { angleX, angleY } = this.getRandomAngle();
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

  getRandomAngle() {
    this.aim = this.game.calcAim(this.game.mouse, this.game.planet);
    const angle = Math.atan2(this.aim.dy, this.aim.dx);
    const angleRange = (Math.PI * 1) / 6;
    const randomAngle = Math.random() * angleRange - angleRange / 2;
    const angleX = Math.cos(angle + randomAngle);
    const angleY = Math.sin(angle + randomAngle);
    return { angleX, angleY };
  }
}

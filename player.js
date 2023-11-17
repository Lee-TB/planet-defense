export class Player {
    constructor(game) {
      this.game = game;
      this.x = this.game.width * 0.5;
      this.y = this.game.height * 0.5;
      this.radius = 40 * this.game.scale;
      this.image = document.getElementById("player");
      this.aim;
      this.angle = Math.PI * 0;
      this.damage = 1;
    }
    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.drawImage(
        this.image,
        0 - this.radius,
        0 - this.radius,
        this.radius * 2,
        this.radius * 2
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();
    }
  
    update() {
      this.aim = this.game.calcAim(this.game.mouse, this.game.planet);
      this.x =
        this.game.planet.x +
        (this.game.planet.radius * 0.8 + this.radius) * this.aim.aimX;
      this.y =
        this.game.planet.y +
        (this.game.planet.radius * 0.8 + this.radius) * this.aim.aimY;
      this.angle = Math.atan2(this.aim.dy * -1, this.aim.dx * -1);
    }
  
    shoot() {
      const projectile = this.game.getProjectile();
      if (projectile) {
        projectile.start(
          this.x + this.aim.aimX * this.radius,
          this.y + this.aim.aimY * this.radius,
          this.aim.aimX,
          this.aim.aimY
        );
      }
    }
  }
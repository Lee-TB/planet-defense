import { Enemy } from "./enemy.js";

export class Asteroid extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("asteroid");
    this.frameY = Math.floor(Math.random() * 4);
    this.frameX = 0;
    this.maxFrame = 6;
    this.maxLives = 3;
    this.lives = this.maxLives;
    this.angle = 0;
    this.vAngle = 0.005;
    this.vAngle = Math.random() < 0.5 ? -this.vAngle : this.vAngle;
  }
  draw(context) {
    super.draw(context);
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.translate(-this.x, -this.y);
    context.restore();
  }
  update() {
    super.update();
    this.angle += this.vAngle;
  }
}

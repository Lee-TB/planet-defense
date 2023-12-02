import { Enemy } from "./enemy.js";

export class Beetlemorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("beetlemorph");
    this.frameY = Math.floor(Math.random() * 4);
    this.frameX = 0;
    this.maxFrame = 2;
    this.maxLives = 1;
    this.lives = this.maxLives;
    this.radius = 30 * this.game.scale;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }
}

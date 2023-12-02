import { Enemy } from "./enemy.js";

export class Lobstermorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("lobstermorph");
    this.frameY = Math.floor(Math.random() * 4);
    this.frameX = 0;
    this.maxFrame = 13;
    this.maxLives = 8;
    this.lives = this.maxLives;
    this.radius = 50 * this.game.scale;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }

  update() {
    super.update();
    if (this.lives >= 1) {
      this.frameX = this.maxLives - this.lives;
    }

    // check collision enemy / planet
    if (this.game.checkCollision(this, this.game.planet)) {
      if (this.frameX < 8) {
        this.frameX = 8;
      }
    }

    // check collision enemy / player
    if (this.game.checkCollision(this, this.game.player)) {
      if (this.frameX < 8) {
        this.frameX = 8;
      }
    }
  }
}

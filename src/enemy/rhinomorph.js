import { Enemy } from "./enemy.js";

export class Rhinomorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("rhinomorph");
    this.frameY = Math.floor(Math.random() * 4);
    this.frameX = 0;
    this.maxFrame = 5;
    this.maxLives = 3;
    this.lives = this.maxLives;
  }

  update() {
    super.update();
    if (this.lives >= 1) {
      this.frameX = this.maxLives - this.lives;
    }

    // check collision enemy / planet
    if (this.game.checkCollision(this, this.game.planet)) {
      if (this.frameX < 2) {
        this.frameX = 2;
      }
    }

    // check collision enemy / player
    if (this.game.checkCollision(this, this.game.player)) {
      if (this.frameX < 2) {
        this.frameX = 2;
      }
    }
  }
}

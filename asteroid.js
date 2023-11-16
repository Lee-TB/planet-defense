import { Enemy } from "./enemy.js";

export class Asteroid extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("asteroid");
    this.frameY = Math.floor(Math.random()*4)
    this.frameX = 0;
    this.maxFrame = 6;
    this.maxLives = 3;
    this.lives = this.maxLives;
  }  
}

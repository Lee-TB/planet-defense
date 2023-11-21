import { Player } from "./player.js";
import { Planet } from "./planet.js";
import { Projectile } from "./projectile.js";
import { Lobstermorph } from "./enemy/lobstermorph.js";
import { Asteroid } from "./enemy/asteroid.js";
import { Beetlemorph } from "./enemy/beetlemorph.js";
import { Rhinomorph } from "./enemy/rhinomorph.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.scale = this.canvas.scale * 0.6;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.baseRefreshRate = 60; // you can choose 60 or 144 and adjust other properties
    this.fps = 60;
    this.speedModifier = (this.baseRefreshRate / this.fps) * this.scale;
    this.projectilePool = [];
    this.numberOfProjectiles = 30;
    this.createProjectilePool();

    this.enemyPool = [];
    this.numberOfEnemies = 20;
    this.createEnemyPool();
    this.enemyIntervalOrigin = 2000;
    this.enemyTimer = 0;
    this.enemyInterval = this.enemyIntervalOrigin;

    this.spriteTimer = 0;
    this.spriteInterval = 100;
    this.spriteUpdate = true;

    this.maxLives = 10;
    this.lives = this.maxLives;
    this.score = 0;
    this.gameOver = false;
    this.debug = false;
    this.timer = 0;
    this.soundVolume = 0.5;

    this.mouse = {
      x: 0,
      y: 0,
    };

    this.planet = new Planet(this);
    this.player = new Player(this);

    // event listeners
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });

    window.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.player.shoot();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "d") {
        this.debug = !this.debug;
      }
    });
  }

  render(context, deltaTime) {
    this.timer += deltaTime;

    this.fps = 1000 / deltaTime; // this fps will be changed depending on your screen refresh rate
    this.speedModifier = (this.baseRefreshRate / this.fps) * this.scale;

    context.clearRect(0, 0, this.width, this.height);
    this.drawStatusText(context);
    this.planet.draw(context);
    this.player.draw(context);
    this.player.update();
    this.projectilePool.forEach((projectile) => {
      projectile.draw(context);
      projectile.update();
    });
    this.enemyPool.forEach((enemy) => {
      enemy.draw(context);
      enemy.update();
    });

    // increase level of difficult by increase speed of enemy generation
    this.increaseGenerativeSpeedOfEnemy();    

    // periodically activate an enemy
    if (!this.gameOver) {
      if (this.enemyTimer < this.enemyInterval) {
        this.enemyTimer += deltaTime;
      } else {
        this.enemyTimer = 0;
        this.shuffle(this.enemyPool);
        const enemy = this.getEnemy();
        if (enemy) {
          enemy.start();
        }
      }
    }

    // periodically update sprite
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteTimer = 0;
      this.spriteUpdate = true;
    } else {
      this.spriteTimer += deltaTime;
      this.spriteUpdate = false;
    }

    if (this.lives < 1) {
      this.gameOver = true;
    }

    if (this.debug) {
      context.beginPath();
      context.strokeStyle = "#A4DE02";
      context.lineWidth = 2;
      context.moveTo(this.planet.x, this.planet.y);
      context.lineTo(this.mouse.x, this.mouse.y);
      context.stroke();
    }
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  drawStatusText(context) {
    context.save();
    context.textAlign = "left";
    context.font = `${24 * this.scale}px Impact`;
    context.fillStyle = "white";
    // Game time
    context.fillText(
      `Time  ${Math.floor(this.timer / 1000 / 60)} : ${(
        (this.timer / 1000) %
        60
      ).toFixed(2)}`,
      20 * this.scale,
      40 * this.scale
    );
    // Game score
    context.fillText(`Score ${this.score}`, 20 * this.scale, 70 * this.scale);

    // Game lives
    for (let i = 0; i < this.lives; i++) {
      context.fillRect(
        (20 + 12 * i) * this.scale,
        80 * this.scale,
        8 * this.scale,
        20 * this.scale
      );
    }
    context.strokeStyle = "white";
    for (let i = 0; i < this.maxLives; i++) {
      context.strokeRect(
        (20 + 12 * i) * this.scale,
        80 * this.scale,
        8 * this.scale,
        20 * this.scale
      );
    }

    // Game result
    if (this.gameOver) {
      let message1 = "End Game !";
      let message2 = `Your score is ${this.score}`;
      context.textAlign = "center";
      context.font = `${100 * this.scale}px Impact`;
      context.fillStyle = "white";

      context.fillText(message1, this.width / 2, 200 * this.scale);
      context.fillText(message2, this.width / 2, 1000 * this.scale);
    }
    context.restore();
  }

  calcAim(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const aimX = dx / distance;
    const aimY = dy / distance;
    return { aimX, aimY, dx, dy };
  }

  checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.radius + b.radius;
    return distance < sumOfRadii;
  }

  createProjectilePool() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      this.projectilePool.push(new Projectile(this));
    }
  }

  getProjectile() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      if (this.projectilePool[i].free) return this.projectilePool[i];
    }
  }

  createEnemyPool() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      this.enemyPool.push(new Rhinomorph(this));
    }
  }

  getEnemy() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      if (this.enemyPool[i].free) return this.enemyPool[i];
    }
  }

  increaseGenerativeSpeedOfEnemy() {
    if (this.enemyInterval > 500) {
      this.enemyInterval = this.enemyIntervalOrigin - 10 * this.score;
    }
    // console.log(this.enemyInterval);
  }
}

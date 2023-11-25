import { Player } from "./player.js";
import { Planet } from "./planet.js";
import { Projectile } from "./projectile.js";
import { Lobstermorph } from "./enemy/lobstermorph.js";
import { Asteroid } from "./enemy/asteroid.js";
import { Beetlemorph } from "./enemy/beetlemorph.js";
import { Rhinomorph } from "./enemy/rhinomorph.js";
import { formatMinutes } from "./utils.js";

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
    this.numberOfEnemies = 40;
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
    this.music = document.getElementById("gameMusic");
    this.music.loop = true;
    this.music.volume = 0.5;
    this.soundVolume = 0.5;
    this.start = false;
    this.pause = true;

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
      if (!this.pause) {
        this.player.shoot();
      }
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

    // Render objects
    context.clearRect(0, 0, this.width, this.height);
    context.drawImage(
      background,
      0,
      0,
      800,
      800,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.drawStatusText(context);

    this.planet.draw(context);
    this.planet.update();

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

    // periodically activate an enemy
    if (!this.gameOver) {
      if (this.enemyTimer < this.enemyInterval) {
        this.enemyTimer += deltaTime;
      } else {
        this.enemyTimer = 0;
        if (this.enemyInterval > 1000) {
          this.enemyInterval = this.enemyIntervalOrigin - this.score * 5;
        }
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
    context.fillText(`Time`, 20 * this.scale, 40 * this.scale);
    context.fillText(
      `${formatMinutes(Math.floor(this.timer / 1000 / 60))}  :  ${(
        (this.timer / 1000) %
        60
      ).toFixed(2)}`,
      20 * this.scale,
      70 * this.scale
    );
    // Game score
    context.fillText(`Score`, 20 * this.scale, 110 * this.scale);
    context.fillText(`${this.score}`, 20 * this.scale, 140 * this.scale);

    // Game lives
    for (let i = 0; i < this.lives; i++) {
      context.fillRect(
        (20 + 12 * i) * this.scale,
        170 * this.scale,
        8 * this.scale,
        20 * this.scale
      );
    }
    context.strokeStyle = "white";
    for (let i = 0; i < this.maxLives; i++) {
      context.strokeRect(
        (20 + 12 * i) * this.scale,
        170 * this.scale,
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
      const randomNumber = Math.random();
      if (randomNumber < 0.4) {
        this.enemyPool.push(new Beetlemorph(this));
      } else if (randomNumber < 0.8) {
        this.enemyPool.push(
          Math.random() < 0.5 ? new Rhinomorph(this) : new Asteroid(this)
        );
      } else {
        this.enemyPool.push(new Lobstermorph(this));
      }
    }
  }

  getEnemy() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      if (this.enemyPool[i].free) return this.enemyPool[i];
    }
  }

  setSoundVolume(volume) {
    this.soundVolume = parseInt(volume) / 100;
  }

  setMusicVolume(volume) {
    this.music.volume = parseInt(volume) / 100;
  }
}

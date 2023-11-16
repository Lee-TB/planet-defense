import { Player } from "./player.js";
import { Planet } from "./planet.js";
import { Projectile } from "./projectile.js";
import { Asteroid } from "./asteroid.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.scale = this.canvas.scale * 0.6;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.planet = new Planet(this);
    this.player = new Player(this);
    this.debug = false;

    this.projectilePool = [];
    this.numberOfProjectiles = 30;
    this.createProjectilePool();

    this.enemyPool = [];
    this.numberOfEnemies = 20;
    this.createEnemyPool();
    this.enemyTimer = 0;
    this.enemyInterval = 500;

    this.spriteTimer = 0;
    this.spriteInterval = 50;
    this.spriteUpdate = true;

    this.fps = 60;
    this.gameInterval = 1000 / this.fps;
    this.gameTimer = 0;

    this.mouse = {
      x: 0,
      y: 0,
    };

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
    this.gameTimer += deltaTime;
    if (this.gameTimer > this.gameInterval) {
      this.gameTimer = 0;

      context.clearRect(0, 0, this.width, this.height);
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

      // periodically activate an enemy
      if (this.enemyTimer < this.enemyInterval) {
        this.enemyTimer += deltaTime;
      } else {
        this.enemyTimer = 0;
        const enemy = this.getEnemy();
        if (enemy) {
          enemy.start();
        }
      }

      // periodically update sprite
      if(this.spriteTimer > this.spriteInterval) {
        this.spriteTimer = 0;
        this.spriteUpdate = true;
      } else {
        this.spriteTimer += deltaTime;
        this.spriteUpdate = false;
      }

      if (this.debug) {
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(this.planet.x, this.planet.y);
        context.lineTo(this.mouse.x, this.mouse.y);
        context.stroke();
      }
    }
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
      this.enemyPool.push(new Asteroid(this));
    }
  }

  getEnemy() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      if (this.enemyPool[i].free) return this.enemyPool[i];
    }
  }
}

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  const scale = Math.min(800, window.innerWidth, window.innerHeight) / 800;
  canvas.scale = scale;
  canvas.width = 800 * canvas.scale;
  canvas.height = 800 * canvas.scale;

  const game = new Game(canvas);
  
  let requestID;
  let lastTime = 0;
  function animate(timeStamp = 0) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);

    requestID = window.requestAnimationFrame(animate);
  }
  requestID = window.requestAnimationFrame(animate);
});

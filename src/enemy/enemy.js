/**
 * Abstract Class Enemy
 *
 * @class Enemy
 */
export class Enemy {
  constructor(game) {
    if (this.constructor === Enemy) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.game = game;
    this.radius = 40 * this.game.scale;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.spriteWidth = 80;
    this.spriteHeight = 80;

    this.x;
    this.y;
    this.speedX;
    this.speedY;
    this.free = true;
    this.collided = false;

    this.enemyExplosionSound = document.getElementById("enemyExplosionSound");
    this.enemyExplosionSound.soundReady = true;
    this.enemyHitSound = document.getElementById("enemyHitSound");
  }

  start() {
    this.free = false;
    if (Math.random() < 0.5) {
      this.x = Math.random() * this.game.width;
      this.y = Math.random() < 0.5 ? 0 - this.height : this.game.height;
    } else {
      this.x = Math.random() < 0.5 ? 0 - this.width : this.game.width;
      this.y = Math.random() * this.game.height;
    }
    const aim = this.game.calcAim(this, this.game.planet);
    this.speedX = -aim.aimX * this.game.speedModifier;
    this.speedY = -aim.aimY * this.game.speedModifier;
    this.angle = Math.atan2(-aim.dx, -aim.dy) * -1;
  }

  reset() {
    this.free = true;
    this.enemyExplosionSound.soundReady = true;
    this.collided = false;
    this.lives = this.maxLives;
    this.frameX = 0;
    this.x = Infinity;
    this.y = Infinity;
  }

  hit(damage) {
    this.lives -= damage;
    this.enemyHitSound.volume = this.game.soundVolume;
    this.enemyHitSound.load();
    this.enemyHitSound.play();
  }

  draw(context) {
    if (!this.free) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.translate(-this.x, -this.y);

      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - this.radius,
        this.y - this.radius,
        this.width,
        this.height
      );
      context.restore();

      if (this.game.debug) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.strokeStyle = "red";
        context.stroke();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px consolas";
        context.fillStyle = "white";
        context.fillText(this.lives, this.x, this.y);
        context.restore();
      }
    }
  }

  update() {
    if (!this.free) {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    // check collision enemy / planet
    if (this.game.checkCollision(this, {...this.game.planet, radius: this.game.planet.radius * 0.8}) && this.lives > 0) {
      this.lives = 0;
      this.collided = true;
      this.game.lives--;
      this.speedX = 0;
      this.speedY = 0;
    }

    // check collision enemy / player
    if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
      this.lives = 0;
      this.collided = true;
      this.game.lives--;
    }

    // check collision enemy / projectile
    this.game.projectilePool.forEach((projectile) => {
      if (
        !projectile.free &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        projectile.reset();
        this.hit(this.game.player.damage);
      }
    });

    // enemy die
    if (this.lives < 1 && this.game.spriteUpdate) {
      this.frameX++;
      this.playExplosion();
    }

    // clear enemy
    if (this.frameX > this.maxFrame) {
      if (!this.collided && !this.game.gameOver) {
        this.game.score += this.maxLives;
      }
      this.reset();
    }
  }

  playExplosion() {
    if(this.enemyExplosionSound.soundReady) { // soundReady make sure this audio run only one time
      this.enemyExplosionSound.soundReady = false;
      this.enemyExplosionSound.volume = this.game.soundVolume;
      this.enemyExplosionSound.play();
    }
  }
}

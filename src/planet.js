export class Planet {
  constructor(game) {
    this.game = game;
    this.x = this.game.width * 0.5;
    this.y = this.game.height * 0.5;
    this.radius = 100 * this.game.scale;
    this.image = document.getElementById("planet");
    this.angle = 0;
    this.vAngle = 0.0005;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.translate(-this.x, -this.y);

    context.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    context.restore();

    if (this.game.debug) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
      context.stroke();
    }
  }

  update() {
    this.angle += this.vAngle;
  }
}

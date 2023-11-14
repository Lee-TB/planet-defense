export class Planet {
    constructor(game) {
      this.game = game;
      this.x = this.game.width * 0.5;
      this.y = this.game.height * 0.5;
      this.radius = 100 * this.game.scale;
      this.image = document.getElementById("planet");
    }
  
    draw(context) {
      context.drawImage(
        this.image,
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
  
      if (this.game.debug) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
        context.stroke();
      }
    }
  }
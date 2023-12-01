import { mobileCheck } from "./detect-mobile-browser";

export class Joystick {
  constructor() {
    this.canvas = document.getElementById("canvasJoystick");
    if (mobileCheck()) {
      this.canvas.style.display = "flex";
    } else {
      this.canvas.style.display = "none";
    }
    this.ctx = this.canvas.getContext("2d");
    this.PI = Math.PI;

    this.angle;
    this.positions = {
      // Here, fixed is the outer circle and inner is the small circle that moves
      fixedX: undefined,
      fixedY: undefined,
      innerX: undefined,
      innerY: undefined,
    };

    this.fixDpiResizeCanvas();
    window.addEventListener("resize", this.fixDpiResizeCanvas);

    this.canvas.addEventListener("touchstart", (e) => {
      this.touchStart(e.touches[0].clientX, e.touches[0].clientY);
    });

    this.canvas.addEventListener("touchmove", (e) => {
      this.touchMove(e.touches[0].clientX, e.touches[0].clientY);
    });

    this.canvas.addEventListener("touchend", () => this.touchEndOrCancel());
    this.canvas.addEventListener("touchcancel", () => this.touchEndOrCancel());

    // TODO: test mouse on pc
    this.canvas.addEventListener("mousedown", (e) => {
      this.touchStart(e.offsetX, e.offsetY);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.touchMove(e.offsetX, e.offsetY);
    });

    this.canvas.addEventListener("mouseup", () => this.touchEndOrCancel());
  }

  fixDpiResizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  touchStart(x, y) {
    if (this.positions.fixedX || this.positions.fixedY) return;
    this.positions.fixedX = this.positions.innerX = x;
    this.positions.fixedY = this.positions.innerY = y;
  }

  touchMove(x, y) {
    if (!(this.positions.fixedX || this.positions.fixedY)) return;

    this.positions.innerX = x;
    this.positions.innerY = y;

    this.angle = Math.atan2(
      this.positions.innerY - this.positions.fixedY,
      this.positions.innerX - this.positions.fixedX
    );

    // If inner circle is outside joystick radius, reduce it to the circumference
    if (
      !(
        (x - this.positions.fixedX) ** 2 + (y - this.positions.fixedY) ** 2 <
        10000
      )
    ) {
      this.positions.innerX = Math.round(
        Math.cos(this.angle) * 100 + this.positions.fixedX
      );
      this.positions.innerY = Math.round(
        Math.sin(this.angle) * 100 + this.positions.fixedY
      );
    }
  }

  touchEndOrCancel() {
    this.positions.fixedX = undefined;
    this.positions.fixedY = undefined;
    this.positions.innerX = undefined;
    this.positions.innerY = undefined;
    this.angle = undefined;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawInnerCircle();
    this.drawOuterCircle();
  }

  // Draw joystick outer circle
  drawOuterCircle() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "#0004";
    this.ctx.arc(
      this.positions.fixedX,
      this.positions.fixedY,
      100,
      0,
      2 * this.PI
    );
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }

  // Draw inner circle
  drawInnerCircle() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#0008";
    this.ctx.arc(
      this.positions.innerX,
      this.positions.innerY,
      30,
      0,
      2 * this.PI
    );
    this.ctx.fill();
    this.ctx.closePath();
  }
}

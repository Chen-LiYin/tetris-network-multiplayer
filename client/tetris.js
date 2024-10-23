class Tetris {
  constructor(element) {
    this.element = element;
    this.canvas = element.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.context.scale(20, 20);

    this.arena = new Arena(12, 20);
    this.player = new Player(this);
    this.player.events.listen("score", (score) => {
      this.updateScore(score);
    });

    this.colors = [
      null,
      "#FF0D72",
      "#0DC2FF",
      "#0DFF72",
      "#F538FF",
      "#FF8E0D",
      "#FFE138",
      "#3877FF",
    ];

    this.player.events.listen("score", (score) => {
      this.updateScore(score);
    });

    let lastTime = 0;
    this._update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      this.player.update(deltaTime);

      this.draw();
      requestAnimationFrame(this._update);
    };

    this.updateScore(0);
  }

  draw() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 繪製網格線
    this.drawGrid();

    this.drawMatrix(this.arena.matrix, { x: 0, y: 0 });
    this.drawMatrix(this.player.matrix, this.player.pos);
  }

  drawGrid() {
    this.context.strokeStyle = "rgba(128, 128, 128, 0.3)"; // 半透明灰色
    this.context.lineWidth = 0.05; // 設置線寬

    // 繪製垂直線
    for (let i = 0; i <= this.arena.matrix[0].length; i++) {
      this.context.beginPath();
      this.context.moveTo(i, 0);
      this.context.lineTo(i, this.arena.matrix.length);
      this.context.stroke();
    }

    // 繪製水平線
    for (let i = 0; i <= this.arena.matrix.length; i++) {
      this.context.beginPath();
      this.context.moveTo(0, i);
      this.context.lineTo(this.arena.matrix[0].length, i);
      this.context.stroke();
    }
  }

  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = this.colors[value];
          this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }

  run() {
    this._update();
  }

  serialize() {
    return {
      arena: {
        matrix: this.arena.matrix,
      },
      player: {
        matrix: this.player.matrix,
        pos: this.player.pos,
        score: this.player.score,
      },
    };
  }

  unserialize(state) {
    this.arena = Object.assign(state.arena);
    this.player = Object.assign(state.player);
    this.updateScore(this.player.score);
    this.draw();
  }

  updateScore(score) {
    this.element.querySelector(".score").innerText = score;
  }
}

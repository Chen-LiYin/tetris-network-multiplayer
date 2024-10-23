class Player {
  constructor(tetris) {
    this.DROP_SLOW = 1000;
    this.DROP_FAST = 50;

    this.events = new Events();

    this.tetris = tetris;
    this.arena = tetris.arena;

    this.dropCounter = 0;
    this.dropInterval = this.DROP_SLOW;

    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.nextPiece = null;
    this.score = 0;

    this.reset();
  }

  createPiece(type) {
    if (type === "T") {
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
    } else if (type === "O") {
      return [
        [2, 2],
        [2, 2],
      ];
    } else if (type === "L") {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ];
    } else if (type === "J") {
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0],
      ];
    } else if (type === "I") {
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
      ];
    } else if (type === "S") {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    } else if (type === "Z") {
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
    }
  }

  drop() {
    this.pos.y++;
    this.dropCounter = 0;
    if (this.arena.collide(this)) {
      this.pos.y--;
      this.arena.merge(this);
      this.reset();
      this.score += this.arena.sweep();
      this.events.emit("score", this.score);
      return;
    }
    this.events.emit("pos", this.pos);
  }

  move(dir) {
    this.pos.x += dir;
    if (this.arena.collide(this)) {
      this.pos.x -= dir;
      return;
    }
    this.events.emit("pos", this.pos);
  }

  reset() {
    const pieces = "ILJOTSZ";
    this.matrix = this.createPiece(pieces[(pieces.length * Math.random()) | 0]);
    if (this.nextPiece) {
      this.matrix = this.nextPiece;
    } else {
      this.matrix = this.createPiece(
        pieces[(pieces.length * Math.random()) | 0]
      );
    }
    this.nextPiece = this.createPiece(
      pieces[(pieces.length * Math.random()) | 0]
    );
    this.generateNextPiece();
    this.pos.y = 0;
    this.pos.x =
      ((this.tetris.arena.matrix[0].length / 2) | 0) -
      ((this.matrix[0].length / 2) | 0);

    if (this.tetris.arena.collide(this)) {
      this.tetris.arena.clear();
      this.score = 0;
      this.events.emit("score", this.score);
    }

    this.events.emit("nextPiece", this.nextPiece);
    this.events.emit("pos", this.pos);
    this.events.emit("matrix", this.matrix);
    console.log("Next piece event emitted");
  }
  generateNextPiece() {
    const pieces = "ILJOTSZ";
    this.nextPiece = this.createPiece(
      pieces[(pieces.length * Math.random()) | 0]
    );
    console.log("Next piece generated:", this.nextPiece);
    this.events.emit("nextPiece", this.nextPiece);
  }

  rotate(dir) {
    const pos = this.pos.x;
    let offset = 1;
    this._rotateMatrix(this.matrix, dir);
    while (this.arena.collide(this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        this._rotateMatrix(this.matrix, -dir);
        this.pos.x = pos;
        return;
      }
    }
    this.events.emit("matrix", this.matrix);
  }

  _rotateMatrix(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }

    if (dir > 0) {
      matrix.forEach((row) => row.reverse());
    } else {
      matrix.reverse();
    }
  }

  update(deltaTime) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }
  handleInput(inputType) {
    switch (inputType) {
      case "left":
        this.move(-1);
        break;
      case "right":
        this.move(1);
        break;
      case "down":
        this.drop();
        break;
      case "rotate":
        this.rotate(1);
        break;
    }
  }
  dropToBottom() {
    while (!this.arena.collide(this)) {
      this.pos.y++;
    }
    this.pos.y--;
    this.arena.merge(this);
    this.reset();
    this.score += this.arena.sweep();
    this.events.emit("score", this.score);
    this.events.emit("pos", this.pos);
  }
}

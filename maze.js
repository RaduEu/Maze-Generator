class maze {
  constructor(rows, cols) {
    this.cells = [];
    for (let i = 0; i < rows; i++) {
      this.cells[i] = [];
      for (let j = 0; j < cols; j++) this.cells[i][j] = new cell(i, j);
    }
  }
}

class cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [true, true, true, true] // N,W,S,E;
  }

  show(visited) {
    
    let X = this.x * boxSize;
    let Y = this.y * boxSize;
    if (this.walls[0]) line(X, Y, X + boxSize, Y);
    if (this.walls[1]) line(X, Y, X, Y + boxSize);
    if (this.walls[2]) line(X, Y+boxSize, X + boxSize, Y+boxSize);
    if (this.walls[3]) line(X+boxSize, Y, X + boxSize, Y+boxSize);
    noStroke();
    fill(128);
    //if(visited) rect(X,Y,boxSize,boxSize);
    stroke(0);
  }
}
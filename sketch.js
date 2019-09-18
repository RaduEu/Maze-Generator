let boxSize = 20;
let maz;
let size;
let cols;
let rows;
let vis = [];
let parent = [];
let holeChance = 0.05; //chance that any particular wall will have a gap in it

function setup() {
  size = 10 + floor(random(40));
  createCanvas(boxSize * size, boxSize * size);
  maz = new maze(size, size);
  reset();
  dfsCreate(0, 0, maz, null);
  addHoles(maz);
  showMaze();
  showPath(true, 4);
  showBestPath();
}

function mousePressed() {
  setup();
}

function addHoles(myMaze) {
  for (let i = 1; i < size-1; i++)
    for (let j = 1; j < size-1; j++)
      for (let dir = 0; dir < 4; dir++) {
        if (random() < holeChance) {
          if(dir==0){
            myMaze.cells[i][j].walls[0]=false
            myMaze.cells[i][j-1].walls[2]=false
          }
          if(dir==1){
            myMaze.cells[i][j].walls[1]=false
            myMaze.cells[i-1][j].walls[3]=false
          }
          if(dir==2){
            myMaze.cells[i][j].walls[2]=false
            myMaze.cells[i][j+1].walls[0]=false
          }
          if(dir==3){
            myMaze.cells[i][j].walls[3]=false
            myMaze.cells[i+1][j].walls[1]=false
          }
        }
      }
}

function showPath(red, w) {
  let currPoint = createVector(size - 1, size - 1);
  //console.log(currPoint);
  while (parent[currPoint.x][currPoint.y]) {
    let nextPoint = createVector(parent[currPoint.x][currPoint.y].x, parent[currPoint.x][currPoint.y].y);
    push();
    strokeWeight(w);
    if (red) stroke(255, 0, 0,100);
    else stroke(0, 0, 255,100);
    translate(boxSize / 2, boxSize / 2);
    line(currPoint.x * boxSize, currPoint.y * boxSize, nextPoint.x * boxSize, nextPoint.y * boxSize);
    pop();
    currPoint = nextPoint;
  }
}

/*function draw() {

  showPath();
}*/

function showBestPath() {
  reset();
  let q = [];
  q.push(createVector(0, 0));
  vis[0][0] = true;
  while (q.length) {
    let f = q[0];
    //console.log(f, q.length);
    q.splice(0, 1);
    if (f.y > 0 && !vis[f.x][f.y - 1] && !maz.cells[f.x][f.y].walls[0]) {
      q.push(createVector(f.x, f.y - 1));
      vis[f.x][f.y - 1] = true;
      parent[f.x][f.y - 1] = createVector(f.x, f.y);
    }
    if (f.y < size - 1 && !vis[f.x][f.y + 1] && !maz.cells[f.x][f.y].walls[2]) {
      q.push(createVector(f.x, f.y + 1));
      vis[f.x][f.y + 1] = true;
      parent[f.x][f.y + 1] = createVector(f.x, f.y);
    }
    if (f.x > 0 && !vis[f.x - 1][f.y] && !maz.cells[f.x][f.y].walls[1]) {
      q.push(createVector(f.x - 1, f.y));
      vis[f.x - 1][f.y] = true;
      parent[f.x - 1][f.y] = createVector(f.x, f.y);
    }
    if (f.x < size - 1 && !vis[f.x + 1][f.y] && !maz.cells[f.x][f.y].walls[3]) {
      q.push(createVector(f.x + 1, f.y));
      vis[f.x + 1][f.y] = true;
      parent[f.x + 1][f.y] = createVector(f.x, f.y);
    }
  }
  /*for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      push();
      translate(boxSize/2,boxSize/2);
      strokeWeight(4);
      if(vis[i][j]) point(i*boxSize,j*boxSize);
      pop();
    }*/
  showPath(false, 4);
}

function dfsCreate(x, y, myMaze, par) {
  //console.log(myMaze);
  vis[x][y] = true;
  parent[x][y] = par;
  let unvisited = [];
  if (y > 0 && !vis[x][y - 1]) unvisited.push(createVector(x, y - 1));
  if (y < size - 1 && !vis[x][y + 1]) unvisited.push(createVector(x, y + 1));
  if (x > 0 && !vis[x - 1][y]) unvisited.push(createVector(x - 1, y));
  if (x < size - 1 && !vis[x + 1][y]) unvisited.push(createVector(x + 1, y));
  while (unvisited.length) {
    let i = floor(random(0, unvisited.length));
    if (vis[unvisited[i].x][unvisited[i].y]) {
      unvisited.splice(i, 1);
      continue;
    }
    if (unvisited[i].x == x + 1 && unvisited[i].y == y) {
      //console.log(x,y);
      myMaze.cells[x][y].walls[3] = false;
      myMaze.cells[x + 1][y].walls[1] = false;
    }
    if (unvisited[i].x == x - 1 && unvisited[i].y == y) {
      myMaze.cells[x][y].walls[1] = false;
      myMaze.cells[x - 1][y].walls[3] = false;
    }
    if (unvisited[i].x == x && unvisited[i].y == y + 1) {
      myMaze.cells[x][y].walls[2] = false;
      myMaze.cells[x][y + 1].walls[0] = false;
    }
    if (unvisited[i].x == x && unvisited[i].y == y - 1) {
      myMaze.cells[x][y].walls[0] = false;
      myMaze.cells[x][y - 1].walls[2] = false;
    }
    dfsCreate(unvisited[i].x, unvisited[i].y, myMaze, createVector(x, y));
    unvisited.splice(i, 1);
  }
}

function reset() {
  for (let i = 0; i < size; i++) {
    vis[i] = [];
    for (let j = 0; j < size; j++)
      vis[i][j] = false;
  }

  for (let i = 0; i < size; i++) {
    parent[i] = [];
    for (let j = 0; j < size; j++)
      parent[i][j] = null;
  }
}

function showMaze() {
  background(220);
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) {
      maz.cells[i][j].show(vis[i][j]);
    }
}
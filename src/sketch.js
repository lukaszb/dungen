const INIT_LIVE_THRESHOLD = 0.8
const ALIVE = 1
const DEAD = 0
const WIDTH = 800
const HEIGHT = 600
const CELL_SIZE = 20
const COLUMNS = Math.floor(WIDTH / CELL_SIZE)
const ROWS = Math.floor(HEIGHT / CELL_SIZE)
const FPS = 120
const MAX_GENERATIONS = 12


class Board {
  constructor(columns, rows) {
    this.columns = columns
    this.rows = rows
    this.table = new Array(columns)
    for (var i=0; i<columns; i++) {
      this.table[i] = new Array(rows)
    }
  }
  set(x, y, value) {
    this.checkCoordinates(x, y)
    this.table[x][y] = value
  }
  get(x, y) {
    this.checkCoordinates(x, y)
    return this.table[x][y]
  }
  checkCoordinates(x, y) {
    if (x < 0 || x >= this.columns) {
      throw new Error(`x must be between 0 and ${this.columns - 1}`)
    }
    if (y < 0 || y >= this.rows) {
      throw new Error(`y must be between 0 and ${this.rows - 1}`)
    }
  }
  getAliveNeighbours(x, y) {
    let count = 0
    for (var i=x-1; i<=x+1; i++) {
      for (var j=y-1; j<=y+1; j++) {
        let state = DEAD
        try {
          state = this.get(i, j)
        } catch (Error) {}
        if (state === ALIVE) count++
      }
    }
    return count
  }
}


const dungen = (p) => {
  window.p = p
  let gray = 0
  let board = new Board(COLUMNS, ROWS)
  let nextBoard = new Board(COLUMNS, ROWS)
  var generation

  p.setup = function () {
    p.frameRate(FPS)
    p.createCanvas(WIDTH, HEIGHT)
    init(board, nextBoard)
  }

  p.draw = function () {
    generation++
    if (MAX_GENERATIONS && generation >= MAX_GENERATIONS) {
      return
    }

    p.background(255)
    computeNextGeneration(board, nextBoard)
    for (var x=0; x < board.columns; x++) {
      for (var y=0; y < board.rows; y++) {
        if (board.get(x, y) === ALIVE) {
          p.fill(0)
        } else {
          p.fill(255)
        }
        p.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
      }
    }
  }

  p.mousePressed = function () {
    init(board, nextBoard);
  }

  function init(board, nextBoard) {
    generation = 0

    for (var x=0; x < board.columns; x++) {
      for (var y=0; y < board.rows; y++) {
        let live = (Math.random() >= INIT_LIVE_THRESHOLD) ? ALIVE : DEAD
        board.set(x, y, live)
        nextBoard.set(x, y, DEAD)
      }
    }
  }

}

// See https://github.com/processing/p5.js/wiki/Instantiation-Cases
new p5(dungen);  // 2nd param can be a canvas html element




function computeNextGeneration(board, nextBoard) {
  for (var x=0; x < board.columns; x++) {
    for (var y=0; y < board.rows; y++) {
      let state = board.get(x, y)
      var aliveNeighbours = board.getAliveNeighbours(x, y)
      if (state === ALIVE) {
        if (aliveNeighbours >= 2 && aliveNeighbours <= 3) {
          nextBoard.set(x, y, ALIVE)
        } else {
          nextBoard.set(x, y, DEAD)
        }
      } else {
        if (aliveNeighbours === 3) {
          nextBoard.set(x, y, ALIVE)
        } else {
          nextBoard.set(x, y, DEAD)
        }
      }
    }
  }
  let temp = board.table
  board.table = nextBoard.table
  nextBoard.table = temp
}

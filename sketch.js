const w = 10
let columns;
let rows;
let board;

function setup() {
    console.log('hello');
    createCanvas(400, 400);

    columns = floor(width / w);
    rows = floor(height / w);

    board = makeBoard(rows, columns)

    randomize()
}

function makeBoard(rows, columns) {
    return new Array(rows).fill(0).map(() => new Array(columns).fill(0));
}

function draw() {
    frameRate(10);
    background(235);
    stroke(0);
    randerBoard()
    next()
}  

function randerBoard() {
    walk((x, y, cell) => {
        if (cell === 0) {
            fill(255);
            rect(x * w, y * w, w, w);
        }
        if (cell === 1) {
            fill(0);
            rect(x * w, y * w, w, w);
        }
    })
}

function randomize() {
    walk((x, y) => {
        board[y][x] = floor(random(2))
    })
}

function next() {
    const cur = structuredClone(board)
    walk((x, y, cell) => {
        const n = sumNeighbours(cur, x, y)
        const result = rule(cell, n)
        board[y][x] = result
    })
}

function walk(fn) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            fn(x, y, board[y][x])
        }
    }
}

function sumNeighbours(board, x, y) {
    let result = 0
    for (let yd = -1; yd <= 1; yd++) {
        for (let xd = -1; xd <= 1; xd++) {
            const yn = (y + yd + columns) % columns
            const xn = (x + xd + rows) % rows
            result += board[yn][xn]
        }
    }
    result -= board[y][x]
    return result
}

function rule(cell, neighbours) {
    // Any live cell with fewer than two live neighbours dies (referred to as underpopulation or exposure[2]).
    if (cell === 1 && neighbours < 2) {
        return 0
    }
    // Any live cell with more than three live neighbours dies (referred to as overpopulation or overcrowding).
    if (cell === 1 && neighbours > 3) {
        return 0
    }
    // Any dead cell with exactly three live neighbours will come to life.
    if (cell === 0 && neighbours === 3) {
        return 1
    }
    // Any live cell with two or three live neighbours lives, unchanged, to the next generation.
    return cell
}

function blinker(x, y) {
    board[y][x + 0] = 1
    board[y][x + 1] = 1
    board[y][x + 2] = 1
}

function glider(x, y) {
    board[y + 0][x + 0] = 1
    board[y + 0][x + 1] = 0
    board[y + 0][x + 2] = 0

    board[y + 1][x + 0] = 0
    board[y + 1][x + 1] = 1
    board[y + 1][x + 2] = 1

    board[y + 2][x + 0] = 1
    board[y + 2][x + 1] = 1
    board[y + 2][x + 2] = 0
}
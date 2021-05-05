// Returns key for a cell based on its x and y coordinates
export function fmtKey(x, y) {
    return x.toString() + "," + y.toString();
}

// Returns key for a cell based on its x and y coordinates, wraps fmtKey
export function fmtCell(cell) {
    return fmtKey(cell.x, cell.y)
}

// Gets a cell's "cell" neighbours within its grid "cells"
export function getNeighbours(cell, cells) {
    // TODO ability to enable neighbours

    let x = cell.x;
    let y = cell.y;

    let neighbours = [];

    neighbours.push(cells.get(fmtKey(x, y+1))) // North
    neighbours.push(cells.get(fmtKey(x, y-1))) // South
    neighbours.push(cells.get(fmtKey(x+1, y))) // East
    neighbours.push(cells.get(fmtKey(x-1, y))) // West

    neighbours = neighbours.filter( Boolean ); // Ensures cell is not undefined
    neighbours = neighbours.filter(cell => !cell.wall)
    neighbours = neighbours.filter(cell => !cell.visited)
    neighbours = neighbours.filter(cell => !cell.visiting)

    return neighbours
}
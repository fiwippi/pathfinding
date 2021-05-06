import {diagonalStore} from "$lib/pathfinding/stores";

// Whether to traverse diagonals
let useDiagonals = false;
const diagonalSub = diagonalStore.subscribe(value => {
    useDiagonals = value;
});

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
    let x = cell.x;
    let y = cell.y;

    let neighbours = [];

    neighbours.push(cells.get(fmtKey(x, y+1))) // North
    neighbours.push(cells.get(fmtKey(x, y-1))) // South
    neighbours.push(cells.get(fmtKey(x+1, y))) // East
    neighbours.push(cells.get(fmtKey(x-1, y))) // West

    if (useDiagonals) {
        neighbours.push(cells.get(fmtKey(x+1, y+1))) // North East
        neighbours.push(cells.get(fmtKey(x-1, y+1))) // North West
        neighbours.push(cells.get(fmtKey(x+1, y-1))) // South East
        neighbours.push(cells.get(fmtKey(x-1, y-1))) // South West
    }

    neighbours = neighbours.filter( Boolean ); // Ensures cell is not undefined
    neighbours = neighbours.filter(cell => !cell.wall)
    neighbours = neighbours.filter(cell => !cell.visited)
    neighbours = neighbours.filter(cell => !cell.visiting)

    return neighbours
}
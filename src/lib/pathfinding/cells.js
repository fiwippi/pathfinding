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

    // Y increases as you go lower, top left is (0, 0)
    neighbours.push(cells.get(fmtKey(x, y-1))) // North
    neighbours.push(cells.get(fmtKey(x-1, y))) // West
    neighbours.push(cells.get(fmtKey(x, y+1))) // South
    neighbours.push(cells.get(fmtKey(x+1, y))) // East

    if (useDiagonals) {
        neighbours.push(cells.get(fmtKey(x+1, y-1))) // North East
        neighbours.push(cells.get(fmtKey(x-1, y-1))) // North West
        neighbours.push(cells.get(fmtKey(x+1, y+1))) // South East
        neighbours.push(cells.get(fmtKey(x-1, y+1))) // South West
    }

    neighbours = neighbours.filter( Boolean ); // Ensures cell is not undefined
    neighbours = neighbours.filter(cell => !cell.wall)
    // neighbours = neighbours.filter(cell => !cell.visited)
    // neighbours = neighbours.filter(cell => !cell.visiting)

    return neighbours
}

// Save grid to a JSON file
export function saveGrid(cells) {
    let blob = new Blob([JSON.stringify([...cells])], {type : 'application/json'});
    let blobUrl = URL.createObjectURL(blob);
    let downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = "grid.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Load grid map from a json file
export async function readGridFile(event){
    return new Promise((resolve) => {
        let fr = new FileReader();
        fr.onload = () => {
            resolve(new Map(JSON.parse(fr.result)));
        };
        fr.readAsText(event.detail.file);
    });
}
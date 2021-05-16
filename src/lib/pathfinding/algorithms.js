import {fmtCell, fmtKey, getNeighbours} from "$lib/pathfinding/cells";
import {sleep} from "$lib/pathfinding/util";
import {runningStore, drawThroughoutStore} from '$lib/pathfinding/stores';
import {PriorityQueue} from '$lib/pathfinding/queue';

// TODO edit scale of the cells
// TODO run pathfinding in a thread so it can be stopped with a function
// TODO make grid fill width

// Determines whether the program is running
let running = false;
const runSub = runningStore.subscribe(value => {
    running = value;
});

// Whether to draw the path throughout
let drawThroughout = false;
const throughoutSub = drawThroughoutStore.subscribe(value => {
    drawThroughout = value;
});

// Heuristic for pathfinding
function heuristic(a, b) {
    let side1 = Math.abs(a.x - b.x)
    let side2 = Math.abs(a.y - b.y)

    return Math.sqrt((side1**2) + (side2**2))
}

// Calculates the cost from traversing from node 'a' to node 'b'
function calcCost(a, b) {
    if (b.terrain) {
        return heuristic(a, b) + 50
    }
    return heuristic(a, b)
}

// Gets a key's value from a map, if undefined returns 0
function getMapNum(key, map, def) {
    let val =  map.get(key)
    if (val === undefined) {
        return def
    }
    return val
}

// Send the updated cells to the main pathfinding svelte component
export function sendCells(c, dispatch) {
    dispatch('data', {
        cells: c,
    });
}

// Wraps formatting cells
function setVisiting(cells, cell, dispatch) {
    cell.visiting = true
    cell.empty = false
    cells.set(fmtCell(cell), cell)
    sendCells(cells, dispatch)

    return [cells, cell]
}

function setVisited(cells, cell, dispatch) {
    cell.visited = true
    cell.visiting = false
    cell.empty = false
    cells.set(fmtCell(cell), cell)
    sendCells(cells, dispatch)

    return [cells, cell]
}

// Drawing the path
export async function drawPath(start, end, path, dispatch, delay, cells) {
    let px = end.x
    let py = end.y

    while ((px !== start.x) || (py !== start.y)) {
        let node = path.get(fmtKey(px, py))
        px += node.dx
        py += node.dy


        let cell = cells.get(fmtKey(px, py))
        cell.path = true
        cells.set(fmtCell(cell), cell)
        sendCells(cells, dispatch)

        if (delay) {
            await sleep(50)
        }
    }
}

// Cleans the path
export async function cleanPath(cells) {
    cells.forEach(function(value, key) {
        value.path = false
        cells.set(key, value)
    })
    return cells
}

// Breadth First Search
export async function bfs(start, end, cells, delay, dispatch) {
    let frontier = [];
    let path = new Map();

    frontier.push(start)
    path.set(fmtCell(start), NaN)

    while (frontier.length !== 0) {
        let current = frontier.shift()

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]
            if (!path.has(fmtCell(next))) {
                [cells, next] = setVisiting(cells, next, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                frontier.push(next)
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})

                [cells, next] = setVisited(cells, next, dispatch)

                if (drawThroughout) {
                    cells = await cleanPath(cells)
                    await drawPath(start, next, path, dispatch, false, cells)
                }

                if (fmtCell(next) === fmtCell(end)) {
                    return path
                }
            }
        }
    }
}

// Greedy Breadth First Search
export async function greedybfs(start, end, cells, delay, dispatch) {
    let frontier = new PriorityQueue((a, b) => a[1] < b[1]);;
    let path = new Map();
    let priority

    frontier.push([start, 0])
    path.set(fmtCell(start), NaN)

    while (frontier.size() !== 0) {
        let current = frontier.pop()[0]

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]

            if (!path.has(fmtCell(next))) {
                [cells, next] = setVisiting(cells, next, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                priority = heuristic(end, next)
                frontier.push([next, priority])
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})

                [cells, next] = setVisited(cells, next, dispatch)

                if (drawThroughout) {
                    cells = await cleanPath(cells)
                    await drawPath(start, next, path, dispatch, false, cells)
                }

                if (fmtCell(next) === fmtCell(end)) {
                    return path
                }
            }
        }
    }
}

// Dijkstra Search
export async function dijkstra(start, end, cells, delay, dispatch) {
    let frontier = new PriorityQueue((a, b) => a[1] < b[1]);;
    let path = new Map();
    let cost = new Map();

    frontier.push([start, 0])
    path.set(fmtCell(start), NaN)
    cost.set(fmtCell(start), 0)

    while (frontier.size() !== 0) {
        let current = frontier.pop()[0]

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]
            let nextCost = getMapNum(fmtCell(current), cost, 0) + calcCost(current, next)
            if (!path.has(fmtCell(next)) || nextCost < getMapNum(fmtCell(next), cost, Number.MAX_SAFE_INTEGER)) {
                [cells, next] = setVisiting(cells, next, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                frontier.push([next, nextCost])
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})
                cost.set(fmtCell(next), nextCost)

                [cells, next] = setVisited(cells, next, dispatch)

                if (drawThroughout) {
                    cells = await cleanPath(cells)
                    await drawPath(start, next, path, dispatch, false, cells)
                }

                if (fmtCell(next) === fmtCell(end)) {
                    return path
                }
            }
        }
    }
}

// A* Search
export async function astar(start, end, cells, delay, dispatch) {
    let frontier = new PriorityQueue((a, b) => a[1] < b[1]);;
    let path = new Map();
    let cost = new Map();
    let priority

    frontier.push([start, 0])
    path.set(fmtCell(start), NaN)
    cost.set(fmtCell(start), 0)

    while (!frontier.isEmpty()) {
        let current = frontier.pop()[0]

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]
            let nextCost = getMapNum(fmtCell(current), cost, 0) + calcCost(current, next)

            if (!path.has(fmtCell(next)) || nextCost < getMapNum(fmtCell(next), cost, Number.MAX_SAFE_INTEGER)) {
                [cells, next] = setVisiting(cells, next, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                priority = nextCost + heuristic(end, next)*3
                frontier.push([next, priority])
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})
                cost.set(fmtCell(next), nextCost)

                [cells, next] = setVisited(cells, next, dispatch)

                if (drawThroughout) {
                    cells = await cleanPath(cells)
                    await drawPath(start, next, path, dispatch, false, cells)
                }

                if (fmtCell(next) === fmtCell(end)) {
                    return path
                }
            }
        }
    }
}
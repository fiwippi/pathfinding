import {fmtCell, getNeighbours} from "$lib/pathfinding/cells";
import {sleep} from "$lib/pathfinding/util";
import {runningStore} from '$lib/pathfinding/stores';
import {PriorityQueue} from '$lib/pathfinding/queue';

// Determines whether the program is running
let running = false;
const runSub = runningStore.subscribe(value => {
    running = value;
});

// Heuristic for pathfinding
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

// Calculates the cost from traversing from node 'a' to node 'b'
function calcCost(a, b) {
    let diagonal = (Math.abs(a.x - b.x)**2 + Math.abs(a.y - b.y)) ** 2 > 1

    if (b.terrain && diagonal) {
        return 22
    } else if (b.terrain) {
        return 18
    } else if (diagonal) {
        return 3
    }
    return 0
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

// Breadth First Search
export async function bfs(start, end, cells, delay, dispatch) {
    let frontier = [];
    let path = new Map();

    frontier.push(start)
    path.set(fmtCell(start), NaN)

    while (frontier.length !== 0) {
        if (!running) {
            return
        }

        let current = frontier.shift()

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]

            if (!path.has(fmtCell(next))) {
                next.visiting = true
                next.empty = false
                next.terrain = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                frontier.push(next)
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})

                next.visited = true
                next.visiting = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

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

    while (!frontier.isEmpty()) {
        if (!running) {
            return
        }

        let current = frontier.pop()[0]

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]

            if (!path.has(fmtCell(next))) {
                next.visiting = true
                next.empty = false
                next.terrain = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                priority = heuristic(end, next)
                frontier.push([next, priority])
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})

                next.visited = true
                next.visiting = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

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

    while (!frontier.isEmpty()) {
        if (!running) {
            return
        }

        let current = frontier.pop()[0]

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]
            let nextCost = getMapNum(fmtCell(current), cost, 0) + calcCost(current, next)

            if (nextCost < getMapNum(fmtCell(next), cost, Number.MAX_SAFE_INTEGER)) {
                next.visiting = true
                next.empty = false
                next.terrain = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                frontier.push([next, nextCost])
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})
                cost.set(fmtCell(next), nextCost)

                next.visited = true
                next.visiting = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

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
        if (!running) {
            return
        }

        let current = frontier.pop()[0]

        let n = getNeighbours(current, cells)
        for (let i = 0; i < n.length; i++) {
            let next = n[i]
            let nextCost = getMapNum(fmtCell(current), cost, 0) + calcCost(current, next)

            if (nextCost < getMapNum(fmtCell(next), cost, Number.MAX_SAFE_INTEGER)) {
                next.visiting = true
                next.empty = false
                next.terrain = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                priority = nextCost + heuristic(end, next)*3
                frontier.push([next, priority])
                path.set(fmtCell(next), {dx: current.x - next.x, dy: current.y - next.y})
                cost.set(fmtCell(next), nextCost)

                next.visited = true
                next.visiting = false
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

                if (fmtCell(next) === fmtCell(end)) {
                    return path
                }
            }
        }
    }
}
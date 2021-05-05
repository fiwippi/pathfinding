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
    let frontier = new PriorityQueue((a, b) => a[1] > b[1]);;
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
                cells.set(fmtCell(next), next)
                sendCells(cells, dispatch)

                if (!running) {
                    return
                }
                await sleep(delay)

                priority = -1 * heuristic(end, next)
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
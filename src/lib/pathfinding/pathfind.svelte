<script>
    import { sleep } from '$lib/pathfinding/util';
    import { fmtKey, fmtCell } from '$lib/pathfinding/cells';
    import { runningStore, diagonalStore, drawThroughoutStore } from '$lib/pathfinding/stores';
    import { sendCells, bfs, greedybfs, dijkstra, astar, drawPath } from "$lib/pathfinding/algorithms";
    import { createEventDispatcher } from 'svelte';
    import Checkbox from "$lib/general/checkbox.svelte";

    // Constants
    const dispatch = createEventDispatcher();

    // Variables
    let delay; // Delay in milliseconds between checking each cell
    let diagonals = false; // Whether to use diagonals
    let drawThroughout = false // Whether to draw the path as the algorithm is running
    let running = false; // Determines whether the program is running
    export let algorithm = "bfs"
    export let speed = 3; // Speed of pathfinding between 1 (slow) to 10 (fast)
    export let cells = new Map(); // The grid cells to perform pathfinding on

    // Dynamic variables
    $: delay = 400 / (Math.min(Math.max(speed, 0), 10))

    const runSub = runningStore.subscribe(value => {
        running = value;
    });

    async function findPath() {
        let data = Array.from(cells.values())

        // Ensure valid start and end cell exist
        let valid = await validStartEndCells(data)
        if (!valid) {
            return
        }

        // Get the starting and ending cells
        let start = data.filter(cell => cell.start)[0]
        let end = data.filter(cell => cell.end)[0]

        // Set whether using diagonals
        if (diagonals) {
            diagonalStore.set(true)
        } else {
            diagonalStore.set(false)
        }

        // Whether to draw the path as its running
        if (drawThroughout) {
            drawThroughoutStore.set(true)
        } else {
            drawThroughoutStore.set(false)
        }

        // Ensures the old pathfinding algorithm is not running
        if (running) {
            runningStore.set(false)
            await sleep(250) // Ensuring the pathfinding algorithm has exited once it's noticed it cant run
        }

        // Clear the grid (removes, visited, visiting and path)
        cells.forEach(function(value, key) {
            value.visited = false
            value.visiting = false
            value.path = false

            if (!value.wall && !value.start && !value.end && !value.terrain) {
                value.empty = true
            }

            cells.set(key, value)
        })
        sendCells(cells, dispatch)

        // Run the visualisation algorithm
        runningStore.set(true)
        let path = undefined;
        console.log(algorithm)
        switch(algorithm) {
            case "greedy-bfs":
                path = await greedybfs(start, end, cells, delay, dispatch)
                break
            case "dijkstra":
                path = await dijkstra(start, end, cells, delay, dispatch)
                break
            case "a-star":
                path = await astar(start, end, cells, delay, dispatch)
                break
            default:
                path = await bfs(start, end, cells, delay, dispatch)
        }
        if (path !== undefined) {
            await drawPath(start, end, path, dispatch, true, cells)
        }
        runningStore.set(false)
    }

    async function validStartEndCells(data) {
        // Validate we only have one starting and ending point
        if (data.filter(cell => cell.start).length !== 1) {
            alert("Must have exactly one starting cell")
            return false
        }
        if (data.filter(cell => cell.end).length !== 1) {
            alert("Must have exactly one ending cell")
            return false
        }
        return true
    }
</script>

<h2>Pathfinding</h2>
<button on:click={findPath}>Draw Path</button>
<Checkbox bind:value={diagonals} label="Use Diagonals?"/>
<Checkbox bind:value={drawThroughout} label="Draw Path Throughout?"/>

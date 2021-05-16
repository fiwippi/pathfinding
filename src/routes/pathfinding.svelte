<script xmlns="http://www.w3.org/1999/html">
    import Cell from '$lib/pathfinding/cell.svelte';
    import Radio from '$lib/general/radio.svelte';
    import Number from '$lib/general/number.svelte';
    import Algo from '$lib/pathfinding/pathfind.svelte';
    import FileUpload from '$lib/general/fileupload.svelte';
    import { fmtKey, saveGrid, readGridFile } from '$lib/pathfinding/cells';
    import { runningStore } from '$lib/pathfinding/stores';
    import {onMount} from "svelte";
    import {sleep} from "$lib/pathfinding/util";

    // Variables
    let cells = new Map(); // The cells on the grid
    let fillType = "start"; // If drawing onto the cell, what type of cell should it be?

    let scale = 50;  // Width/Height of the cell in pixels
    let width = 10;  // Number of cells making the grid widthways
    let height = 13; // Number of cells making the grid lengthways

    let pixelWidth;  // Width of the grid in pixels
    let pixelHeight; // Height of the grid in pixels

    let speed = 5; // How fast should the pathfinding happen, 1 (slowest) to 10 (quickest)

    let algorithm = "bfs"; // Which algorithm to use
    let files; // File to load from user to convert to grid

    // Dynamic variables
    $: pixelWidth = width * scale
    $: pixelHeight = height * scale
    $: cells = updateCells(width, height)

    // Clears the grid and stops all ongoing pathfinding operations
    async function clearGrid() {
        runningStore.set(false)
        await sleep(100)
        cells.forEach(function(value, key) {
            value.visited = false
            value.visiting = false
            value.path = false
            value.wall = false
            value.start = false
            value.end = false
            value.terrain = false
            value.empty = true
            cells.set(key, value)
        })
        cells = cells // Triggers an update to cells
    }

    // Redraws the cell grid
    function updateCells(w, h) {
        let c = new Map();
        let counter = 0
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                // Assume cell is default
                let a = {visited:false, visiting:false,
                    wall:false, path:false, empty:true,
                    start:false, end:false, terrain: false};

                // If the old cell at this grid position is not default then draw the new cell like it
                if (cells.has(fmtKey(i, j))) {
                    let old = cells.get(fmtKey(i, j))
                    a.visited = old.visited
                    a.visiting = old.visiting
                    a.wall = old.wall
                    a.path = old.path
                    a.empty = old.empty
                    a.start = old.start
                    a.end = old.end
                    a.terrain = old.terrain
                }

                c.set(fmtKey(i, j),  {
                    x: i, y: j, cnt: counter,
                    visited: a.visited, visiting: a.visiting,
                    wall: a.wall, path: a.path, empty: a.empty,
                    start: a.start, end: a.end, terrain: a.terrain
                })

                // Counter keeps a unique id for each cell for iteration with each block
                counter++
            }
        }
        return c
    }

    // Triggers redraw of cells with cells retrieved from the pathfinding algorithm
    function handleCells(event) {
        cells = event.detail.cells
    }

    // Loads grid from a file
    async function loadGrid(event) {
        cells = await readGridFile(event)
    }

    onMount(async () => {
        let totalWidth = document.getElementById("container-div").offsetWidth
        let settingsWidth = document.getElementById("settings-div").offsetWidth
        let availableWidth = totalWidth - settingsWidth
        width = Math.floor(availableWidth / scale)
    });
</script>

<style>
    .container {
        display: flex;
        flex-direction: row;
    }

    svg {
        border: 1px solid black;
    }
</style>

<div class="container" id="container-div">
    <div id="settings-div">
        <h2>Grid</h2>
        <Number bind:value={width} numLabel={"Width:"} />
        <Number bind:value={height} numLabel={"Height:"} />
        <Number bind:value={scale} numLabel={"Scale:"} numMin={20} numMax={50}/>
        <p>
            <button on:click={() => saveGrid(cells)}>Save Grid</button>
            <FileUpload on:upload={loadGrid} bind:files accept="application/json" label="Load Grid" multiple={false}/>
        </p>

        <h2>Draw</h2>
        <Radio bind:group={fillType} radioValue={"start"} radioLabel="Start" />
        <Radio bind:group={fillType} radioValue={"end"} radioLabel="End" />
        <Radio bind:group={fillType} radioValue={"wall"} radioLabel="Wall" />
        <Radio bind:group={fillType} radioValue={"terrain"} radioLabel="Terrain" />
        <p><button on:click={clearGrid}>Clear Grid</button></p>

        <h2>Algorithm</h2>
        <Radio bind:group={algorithm} radioValue={"bfs"} radioLabel="Breadth First Search" />
        <Radio bind:group={algorithm} radioValue={"greedy-bfs"} radioLabel="Greedy BFS" />
        <Radio bind:group={algorithm} radioValue={"dijkstra"} radioLabel="Dijkstra" />
        <Radio bind:group={algorithm} radioValue={"a-star"} radioLabel="A*" />
        <p><Number bind:value={speed} numLabel={"Speed (1-10):"} numMin={1} numMax={10}/></p>

        <p>
            <Algo bind:cells on:data={handleCells} bind:speed {algorithm}/>
        </p>
    </div>
    <div id="grid-div">
        <svg width={pixelWidth} height={pixelHeight}>
            {#each [...cells] as [key, cell] (cell.cnt)}
                <Cell x={cell.x} y={cell.y}
                      {scale}
                      fillType={fillType}
                      bind:isEnd={cell.end}
                      bind:isWall={cell.wall}
                      bind:isPath={cell.path}
                      bind:isStart={cell.start}
                      bind:isEmpty={cell.empty}
                      bind:isTerrain={cell.terrain}
                      bind:isVisited={cell.visited}
                      bind:isVisiting={cell.visiting} />
            {/each}
        </svg>
    </div>
</div>

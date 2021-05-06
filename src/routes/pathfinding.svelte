<script>
    // TODO styling
    // TODO modularise for cleaner code

    import Cell from '$lib/pathfinding/cell.svelte';
    import Radio from '$lib/pathfinding/radio.svelte';
    import Number from '$lib/pathfinding/number.svelte';
    import Algo from '$lib/pathfinding/pathfinding.svelte';
    import { fmtKey } from '$lib/pathfinding/cells';
    import { runningStore } from '$lib/pathfinding/stores';

    // Variables
    let cells = new Map(); // The cells on the grid
    let fillType = "start"; // If drawing onto the cell, what type of cell should it be?

    let scale = 50;  // Width/Height of the cell in pixels
    let width = 15;  // Number of cells making the grid widthways
    let height = 10; // Number of cells making the grid lengthways

    let pixelWidth;  // Width of the grid in pixels
    let pixelHeight; // Height of the grid in pixels

    let speed = 3; // How fast should the pathfinding happen, 1 (slowest) to 10 (quickest)

    // Dynamic variables
    $: pixelWidth = width * scale
    $: pixelHeight = height * scale
    $: cells = updateCells(width, height)

    // Clears the grid and stops all ongoing pathfinding operations
    function clearGrid() {
        runningStore.set(false)
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
</script>

<h2>Cell Type</h2>
<Radio bind:group={fillType} radioValue={"start"} radioLabel="Start" />
<Radio bind:group={fillType} radioValue={"end"} radioLabel="End" />
<Radio bind:group={fillType} radioValue={"wall"} radioLabel="Wall" />
<Radio bind:group={fillType} radioValue={"terrain"} radioLabel="Terrain" />

<h2>Grid</h2>
<Number bind:value={width} numLabel={"Width"} />
<Number bind:value={height} numLabel={"Height"} />
<Number bind:value={speed} numLabel={"Speed"} numMin={1} numMax={10}/>

<p>
    <Algo bind:cells on:data={handleCells} bind:speed/>
    <button on:click={clearGrid}>Clear Grid</button>
</p>
<p>
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
</p>
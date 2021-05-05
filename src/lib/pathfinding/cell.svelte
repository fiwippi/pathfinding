<script>
    import { press } from '$lib/pathfinding/actions'
    import { fillStore, runningStore } from '$lib/pathfinding/stores';

    // Height and width
    export let scale = 50;
    let width = scale;
    let height = scale;

    // Coordinates
    export let x = 0;
    export let y = 0;

    let coordX;
    let coordY;

    $: coordX = x * scale;
    $: coordY = y * scale;

    // Determines whether the program is running
    let running = false;

    const runSub = runningStore.subscribe(value => {
        running = value;
    });

    // Fill
    export let fillType = "wall" // When toggling, this decides what the fill type should be
    export let fillMode = ""; // Whether the current file is adding or removing

    const fillSub = fillStore.subscribe(value => {
        fillMode = value;
    });

    // Defaults cell values to empty
    export let isVisited = false;
    export let isVisiting = false;
    export let isPath = false;
    export let isEmpty = true;
    export let isWall = false;
    export let isStart = false;
    export let isEnd = false;

    // Resets the fill mode to nothing
    function resetFillMode() {
        fillStore.set("");
    }

    // Fills in/Removes fill from a cell
    function toggleFill(event) {
        if (!running) {
            // Figure out if we have previously added/removed fill to/from a cell whilst the mouse is still held down.
            // This ensures that we only add or only remove to cells and not add to some cells and remove from some
            // cells with the same mouse press
            if (fillMode === "") {
                if ((fillType === "wall" && !isWall) || (fillType === "start" && !isStart) || (fillType === "end" && !isEnd)) {
                    fillStore.set("add");
                } else {
                    fillStore.set("remove");
                }
            }

            // Adding
            if (fillMode === "add") {
                if (fillType === "wall") {
                    isEnd = false
                    isWall = true
                    isStart = false
                }
                if (fillType === "start") {
                    isEnd = false
                    isWall = false
                    isStart = true
                }
                if (fillType === "end") {
                    isEnd = true
                    isWall = false
                    isStart = false
                }
                isEmpty = false
            } else {
                // Removing
                isEnd = false
                isWall = false
                isStart = false
                isEmpty = true
            }
        }
    }
</script>

<style>
    .visited {fill: rgb(237,54,91);}
    .visiting {fill: rgb(20, 220, 180);}
    .wall {fill: gray;}
    .path {fill: orange;}
    .empty {fill: wheat;}
    .start {fill: lime;}
    .end {fill: red;}

    rect {
        stroke: black;
        stroke-width: 1;
        fill-opacity: 1;
        stroke-opacity: 1;
    }
</style>

<rect x={coordX} y={coordY} {width} {height}
      class:visited={isVisited} class:visiting={isVisiting}
      class:path={isPath} class:empty={isEmpty} class:wall={isWall}
      class:start={isStart} class:end={isEnd} on:mouseup={resetFillMode}
      use:press on:pressdown={toggleFill}></rect>

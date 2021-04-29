<script>
    import Point from '$lib/paint/Point.svelte';
    import { press } from '$lib/paint/actions';
    import save from '$lib/svg/save-svg';

    let image;

    export let px = 0;
    export let py = 0;

    let points = [];
    let displayBrush = false

    function createBrush(event) {
        displayBrush = true
    }

    function updateBrush(event) {
        px = event.clientX;
        py = event.clientY;
    }

    function showBrush() {
        if (!displayBrush) {
            displayBrush = true
        }
    }

    function hideBrush() {
        if (displayBrush) {
            displayBrush = false
        }
    }

    function draw(event) {
        points = [...points, { x: event.detail.x, y: event.detail.y }]
    }
</script>

<style>
    svg {
        width: 100%;
        height: 100%;
        cursor: none;
    }

    :global(html, body, #svelte) {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
    }
</style>

<svg on:mousemove={updateBrush} on:mousemove|once={createBrush} use:press on:drawbrush|self={draw} bind:this={image}>
    <rect width="100%" height="100%" fill="black" />
    {#each points as {x,y}}
        <Point {x} {y}/>
    {/each}
    {#if displayBrush}
        <Point x={px} y={py} />
    {/if}
</svg>

<button on:click={save(image)} on:mouseover={hideBrush} on:mouseout={showBrush}>Save</button>
<button on:click={() => {points = []}}>Reset</button>



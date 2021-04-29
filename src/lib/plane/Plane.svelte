<script>
    import { fly } from 'svelte/transition'

    export let duration = 2000;
    let flying = false;

    function rainbow(node, { duration }) {
        return {
            duration,
            css: t => {
                return `
					fill: hsl(
						${~~(t * 360)},
						${Math.min(100, 1000 - 1000 * t)}%,
						${Math.min(50, 500 - 500 * t)}%
					);`
            }
        };
    }
</script>

<style>
    path {
        stroke: black;
        stroke-width: 5px;
        fill: dodgerblue;
        transition: 5s;
    }

</style>

<button on:click={() => {flying = !flying}}>
    {#if !flying}
        fly...
    {:else }
        bye
    {/if}
</button>

{#if flying}
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="500">
        <title>copethunder</title>
        <path in:rainbow="{{ duration }}" out:fly="{{ x: 1000, duration: duration }}" d="M 41,217 24,203 0,159 18,144 94,212 H 111 L 94,86 140,83 244,210 350,216 V 236 H 441 L 500,250 441,264 H 350 V 284 L 244,290 140,417 94,414 111,288 H 94 L 18,356 0,341 24,297 41,283 Z"/>
    </svg>
{/if}

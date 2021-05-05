<script>
    export let numMin = 2;
    export let numMax = 30;
    export let numLabel;
    export let value;
</script>

<label>
    {numLabel}
    <input type=number bind:value min={numMin} max={numMax}>
</label>
<script>
    export let radioValue;
    export let radioLabel
    export let group;
</script>

<label>
    <input type=radio bind:group value={radioValue}>
    {radioLabel}
</label>
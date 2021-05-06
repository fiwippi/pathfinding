<script>
    export let value;
    export let label;
</script>

<label>
    <input type=checkbox bind:checked={value}>
    {label}
</label>
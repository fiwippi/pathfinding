<script>
    export let files;
    export let label;
    export let accept = "";
    export let multiple = true;
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function upload(event) {
        const file = event.target && event.target.files && event.target.files[0]
        if (file) {
            dispatch('upload', {
                file: file,
            });
        }
    }
</script>

<style>
    input {
        visibility: hidden;
    }

    label:hover {
        background-color: #dbe2cb;
    }

    label {
        display: inline-block;
        text-align: center;
        margin: 0em;
        background-color: #E6EED6;
        color: black;
        padding: 1px 6px;
        font: 400 13px 'Noto Sans JP', sans-serif;
        border: 1px solid black;
        cursor: pointer;
    }
</style>

<label for="files" class="button">{label}</label>
<input on:change={upload} id="files" type="file" {multiple} bind:files {accept}>

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
</style>

<label for="files" class="button">{label}</label>
<input on:change={upload} id="files" type="file" {multiple} bind:files {accept}>

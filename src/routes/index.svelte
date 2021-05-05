<script>
    let links = [
        { name: "Pathfinding", href: "/pathfinding" },
    ]
</script>

<!-- TODO make title page a big svg font with the word fanta and a ball hitting off the words?-->
<!-- TODO set a global font -->

<style>
    :global(#svelte) {
        margin-left: 20px;
    }

    a {
        color: black;
        text-decoration: none;
        border-bottom: 1px solid black;
    }

    a:hover,
    a:focus {
        color: orangered;
        border-bottom: none;
    }
</style>

<h1>routes:</h1>
{#each links as link}
    → <a href="{ link.href }">{ link.name }</a><br><br>
{/each}
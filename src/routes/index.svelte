<script>
    let links = [
        { name: "Pathfinding", href: "/pathfinding" },
    ]
</script>

<style>
    #sakura {
        border-bottom: none;
        text-shadow:
                3px   3px 0 #ffb534,
                /*3px   3px 0 #e7446a,*/
                -1px -1px 0 #ffb534,
                1px  -1px 0 #ffb534,
                -1px  1px 0 #ffb534,
                1px   1px 0 #ffb534;
    }
</style>

<h1><a id="sakura" href="/">ファンタ.soda.cx</a></h1>
{#each links as link}
    →  <a href="{ link.href }">{ link.name }</a><br><br>
{/each}
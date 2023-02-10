<script>
  import Struct from "./cmps/struct.svelte";
  import Page from "./cmps/page.svelte";
  import { onMount } from "svelte";
  import { INDEX } from "./objs/keyIndex";
  import { Index } from "./srv/files";

  function toto(id, evt) {
    console.log(id, evt.target);
  }
  onMount(() => {
    Index.getRules().then((rules) => {
      INDEX.load(rules);
      console.log(INDEX.getIndex())
    });
  });
</script>

<main>
  <div id="struct"><Struct /></div>
  <div id="page"><Page /></div>
</main>

<style>
  main {
    /* display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;*/
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    height: 100%;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  #struct {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;

    /*  grid-column: 1;*/
  }
  #page {
    margin-left: 205px;
  }
  :global(.btnsvg) {
    fill: rgb(255, 195, 128);
    stroke: rgb(255, 195, 128);
  }
  :global(.lnk){
    cursor:pointer
  }
</style>

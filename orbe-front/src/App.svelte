<script lang="ts">
  import Struct from "./cmps/struct.svelte";
  import Page from "./cmps/page.svelte";
  import Toast from "./cmps/toast.svelte";
  import { onMount, onDestroy } from "svelte";
  import { INDEX } from "./helpers/keyIndex";
  import { Index } from "./srv/files";

  onMount(() => {
    Index.getRules().then((rules) => {
      INDEX.load(rules);
    });
    window.addEventListener("StructLoading", startLoad);
    window.addEventListener("StructLoadStop", stopLoad);
  });
  onDestroy(async () => {
    window.removeEventListener("StructLoading", startLoad);
    window.removeEventListener("StructLoadStop", stopLoad);
  });

  let loading = false;
  let loadTimer: any;

  let divMain: HTMLElement;
  let divCache: HTMLDivElement;

  function stopLoad() {
    loading = false;
    divCache.style.display = "none";
    window.clearTimeout(loadTimer);
    loadTimer = null;
  }
  function startLoad() {
    loading = true;
    divCache.style.top = `${divMain.clientTop}px`;
    divCache.style.left = `${divMain.clientLeft}px`;
    divCache.style.width = `${divMain.clientWidth}px`;
    divCache.style.height = `${divMain.clientHeight}px`;
    divCache.style.display = "block";
    if (loadTimer) window.clearTimeout(loadTimer);
    loadTimer = window.setTimeout(stopLoad, 10000);
  }
</script>

<main bind:this={divMain}>
  <div id="struct"><Struct /></div>
  <div id="page"><Page /></div>
  <div id="cache" bind:this={divCache}>&nbsp;</div>
  <Toast />
</main>

<style>
  #cache {
    display: none;
    position: absolute;
    z-index: 100;
    background-color: white;
    opacity: 0.5;
  }
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
  :global(.lnk) {
    cursor: pointer;
  }
</style>

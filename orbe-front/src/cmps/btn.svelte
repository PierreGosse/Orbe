<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "svelte-icon";

  export let action: (id, evt) => void;
  export let id: any = {};
  export let img: any | undefined = undefined;
  export let txt: string = "";
  export let cls: string = "";

  let button: any;

  function doAction(evt) {
    action(id, evt);
  }
  onMount(async () => {});
</script>

<button bind:this={button} on:click={doAction} class={cls}>
  {#if img}
    <Icon data={img} class={cls} />
  {:else}
    {txt}
  {/if}
</button>

<style>
  button {
    border: none;
    background-color: transparent;
    margin: 0px 2px 0px 2px;
    padding: 0px 0px;
    cursor: pointer;
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let shift: boolean = false;
  export let ctrl: boolean = false;
  export let alt: boolean = false;

  export let key: string;
  export let action: () => void;

  function keyPress(e: KeyboardEvent) {
    console.log(e);
    if (
      e.shiftKey == shift &&
      e.ctrlKey == ctrl &&
      e.altKey == alt &&
      e.key == key
    ) {
      e.preventDefault();
      action();
    }
  }
  onMount(() => {
    window.addEventListener("keydown", keyPress);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", keyPress);
  });
</script>

<div />

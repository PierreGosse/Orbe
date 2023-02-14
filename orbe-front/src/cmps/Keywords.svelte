<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { KEYINDEXREG } from "orbe-common";
  import CmpKey from "./cmpKey.svelte";

  export let keys: string[];
  export let dirty: boolean;

  let edKeys: string;
  let editKeys = false;
  let editDiv: HTMLDivElement;

  function doEdit() {
    editKeys = true;
    edKeys = keys
      .map((k) => {
        return `<p>${k}</p>`;
      })
      .join("");
  }
  function init(e) {
    e.focus();
  }
  function cancel() {
    editKeys = false;
  }
  function save() {
    editKeys = false;
    dirty = true;
    const kk = edKeys
      ? edKeys
          .replaceAll("\n", "")
          .replaceAll(/\<br\/?\>/gi, "")
          .match(
            /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/gi
          )
          .map((l) => {
            const m = l.match(
              /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/i
            );
            return (m.groups.precont ? m.groups.precont : "") + m.groups.content
              ? m.groups.content
              : "";
          })
          .map((l) => {
            let m;
            let resp = [];
            while ((m = KEYINDEXREG.exec(l)) != null) {
              if (m.groups.ok) resp.push(m[0]);
            }
            return resp.join(" ");
          })
      : [];
    keys = kk.filter((d) => d > "");
  }
</script>

<div id="keys">
  <CmpKey key="Escape" action={cancel} />
  mots clés
  {#if editKeys}
    <div
      contenteditable="true"
      bind:this={editDiv}
      bind:innerHTML={edKeys}
      on:blur={save}
      use:init
    >
      {#each keys as k}
        <p>{k}</p>
      {/each}
    </div>
  {:else}
    <input type="text" value={keys.join(", ")} on:focus={doEdit} />
  {/if}
</div>

<style>
  #keys {
    width: 80%;
  }
</style>

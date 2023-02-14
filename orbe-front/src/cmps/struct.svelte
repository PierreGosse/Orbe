<script lang="ts">
  import Btn from "./btn.svelte";
  import delbin from "../imgs/delete.svg";
  import add from "../imgs/add.svg";
  import cancel from "../imgs/cancel.svg";
  import ok from "../imgs/ok.svg";
  import { onMount  } from "svelte";
  import { Struct } from "../srv/files";

  let stypes: string[] = ["toto"];
  let pages: string[] = [];
  let selType: string;
  let hasPage = false;
  let selPage: string;

  let divStruct: HTMLDivElement;

  onMount(async () => {
    const sts = await Struct.getStruct();
    stypes = sts.types;
    stypes.sort();
  });

  let isAdding = false;
  let newname: string = "";
  async function openAdd() {
    isAdding = true;
  }
  async function doAdd() {
    isAdding = false;
    const sts = await Struct.addStruct(newname);
    newname = "";
    stypes = sts.types;
    stypes.sort();
  }
  async function doAddCancel() {
    isAdding = false;
    newname = "";
  }
  async function doDel(vl, evt) {
    if (hasPage) return;
    const sts = await Struct.delStruct(vl);
    stypes = sts.types;
    stypes.sort();
  }
  async function doSelect(evt) {
    selType = evt.target.attributes.vt.value;
    window.dispatchEvent(new CustomEvent("StructLoading"));
    pages=[]
    pages = await Struct.listPages(selType);
    window.dispatchEvent(new CustomEvent("StructLoadStop"));
    pages.sort();
    hasPage = pages && pages.length > 0;
  }
  async function doOpen(evt) {
    selType = evt.target.attributes.vt.value;
    selPage = evt.target.attributes.vp.value;
    window.dispatchEvent(
      new CustomEvent("openPage", { detail: { type: selType, page: selPage } })
    );
  }
  async function doAddPage(selType, evt) {
    window.dispatchEvent(
      new CustomEvent("openPage", { detail: { type: selType } })
    );
  }

</script>

<div>
  <div bind:this={divStruct}>
    <ul>
      {#each stypes as ty}
        <li>
          <button class:selected={ty == selType} vt={ty} on:click={doSelect}
            >{ty}</button
          >
          {#if ty == selType && !hasPage}
            <Btn cls="btnsvg" id={ty} action={doDel} img={delbin} />
          {/if}
          {#if ty === selType}
            <ul>
              {#each pages as p}
                <li on:mouseup={doOpen} vt={ty} vp={p}>{p}</li>
              {/each}
            </ul>
            <div>
              &nbsp;<Btn
                id={ty}
                action={doAddPage}
                img={add}
                cls="btnsvg libtn"
              />
            </div>
          {/if}
        </li>
      {/each}
    </ul>
    {#if isAdding}
      <input type="text" bind:value={newname} />
      <Btn action={doAddCancel} img={cancel} cls="btnsvg" />
      <Btn action={doAdd} img={ok} cls="btnsvg" />
    {:else}
      <Btn action={openAdd} img={add} cls="btnsvg" />
    {/if}
  </div>
</div>

<style>
  div {
    /*float: left;
    width: 200px;
    min-height: 200px;*/
    height: 100%;
  }
  ul {
    text-align: left;
  }
  li {
    padding: 4px 2px;
    cursor: pointer;
  }
  .selected {
    font-weight: bold;
    color: brown;
  }
  button {
    border: none;
    background-color: transparent;
    margin: 0px 2px 0px 10px;
    padding: 0px 2px;
    cursor: pointer;
  }

</style>

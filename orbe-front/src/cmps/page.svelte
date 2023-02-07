<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { IPage, IPara } from "orbe-common";
  import { Page } from "../srv/files";
  import Btn from "./btn.svelte";
  import save from "../imgs/save.svg";
  import delbin from "../imgs/delete.svg";
  import edit from "../imgs/edit.svg";

  let editKeys = false;
  let curPage: IPage | undefined;
  let initialTitle: string;
  let content: string = "";
  let renaming = false;
  function openPage(evt) {
    console.log(evt.detail);
    if (evt.detail.page) {
      Page.get(evt.detail.type, evt.detail.page).then((p: IPage) => {
        console.log(p);
        curPage = p;
        content = p.content
          .map((p: IPara) => {
            const style = p.style ? p.style : "p";
            return `<${style}>${p.para.replaceAll("\n", "<br>")}</${style}>`;
          })
          .join("\n");
        initialTitle = curPage.name;
        dirty = false;
      });
    } else {
      curPage = {
        type: evt.detail.type,
        name: "",
        keys: [],
        content: [],
      };
      initialTitle = "";
      content = "";
      dirty = false;
    }
  }
  let dirty = false;
  function onChange() {
    console.log('onChange',content)
    dirty = true;
  }
  function titleChange() {
    renaming = false;
    if (initialTitle != curPage.name) dirty = true;
  }
  function startRename() {
    renaming = true;
  }
  function initTitle(el) {
    el.focus();
  }
  onMount(() => {
    window.addEventListener("openPage", openPage);
  });
  onDestroy(() => {
    window.removeEventListener("openPage", openPage);
  });

  function doSave(id, evt) {
    const paras = content
      .replaceAll("\n", "")
      .replaceAll(/\<br\/?\>/gi, "\n")
      .match(
        /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/gi
      )
      .map((l) => {
        const m = l.match(
          /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/i
        );
        return {
          style: m.groups.tag == "div" ? "p" : m.groups.tag,
          para: (m.groups.precont ? m.groups.precont : "") + m.groups.content,
        };
      });
    curPage.content = paras;
    console.log(
      curPage,
      content,
      content
        .replaceAll("\n", "")
        .replaceAll(/\<br\/?\>/gi, "\n")
        .match(
          /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/gi
        )
    );
    if (curPage.name) {
      Page.save(curPage);
    }
    console.log(id, evt);
  }
  function doDelete(id, evt) {
    console.log(id, evt);
  }
</script>

<div class="main">
  {#if curPage}
    {#if renaming || !curPage.name}
      <input
        type="text"
        class="title"
        on:blur={titleChange}
        bind:value={curPage.name}
        use:initTitle
      />
    {:else}
      <span class="title">{curPage.name}</span>
      <Btn action={startRename} img={edit} cls="btnsvg" />
    {/if}
    <Btn action={doDelete} img={delbin} cls="btnsvg cmd" />
    {#if editKeys}
      {#each curPage.keys as k}
        <p>k</p>
      {/each}
      <div contenteditable="true" />
    {:else}
      <div>{curPage.keys.join(", ")}</div>
    {/if}
    <div contenteditable="true" on:input={onChange} bind:innerHTML={content} />
    {#if dirty}
      <Btn action={doSave} img={save} cls="btnsvg cmd" />
    {/if}
  {/if}
</div>

<style>
  [contenteditable] {
    width: 100%;
    border: 1px solid orange;
    padding: 5px;
  }
  .main {
    text-align: left;
    width: 100%;
  }
  .title {
    font-size: large;
    margin: 2px;
    padding: 5px;
  }
</style>

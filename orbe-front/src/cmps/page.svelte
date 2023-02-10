<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { IPage, IPara } from "orbe-common";
  import { Page } from "../srv/files";
  import Btn from "./btn.svelte";
  import ok from "../imgs/ok.svg";
  import cancel from "../imgs/cancel.svg";
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
    console.log("onChange", content);
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
      Page.save(curPage).then(() => {
        dirty = false
        console.log(id, evt)
      });
    }
  }
  function doDelete(id, evt) {
    console.log(id, evt);
  }
  let edKeys;
  function modKeys() {
    editKeys = true;
    edKeys = curPage.keys
      .map((k) => {
        return `<p>${k}</p>`;
      })
      .join("");
  }
  function cancelKeys() {
    editKeys = false;
  }
  function okKeys() {
    editKeys = false;
    dirty = true;
    const kk = edKeys
      .replaceAll("\n", "")
      .replaceAll(/\<br\/?\>/gi, "")
      .match(
        /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/gi
      )
      .map((l) => {
        const m = l.match(
          /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/i
        );
        return (m.groups.precont ? m.groups.precont : "") + m.groups.content;
      });
    curPage.keys = [];
    for (const k of kk) if (k > "") curPage.keys.push(k);
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
    <br />
    <div id="keys">
      mots clés
      {#if editKeys}
        <div contenteditable="true" bind:innerHTML={edKeys}>
          {#each curPage.keys as k}
            <p>{k}</p>
          {/each}
        </div>
        &nbsp;
        <span class="cmd">
          <Btn action={cancelKeys} img={cancel} cls="btnsvg" />
          <Btn action={okKeys} img={ok} cls="btnsvg" />
        </span>
      {:else}
        <span>{curPage.keys.join(", ")}</span>
        <Btn action={modKeys} img={edit} cls="btnsvg cmd" />
      {/if}
    </div>
    <br />
    <div contenteditable="true" on:input={onChange} bind:innerHTML={content} />
    {#if dirty}
      <Btn action={doSave} img={save} cls="btnsvg cmd" />
    {/if}
  {/if}
</div>

<style>
  #keys {
    width: 80%;
  }
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

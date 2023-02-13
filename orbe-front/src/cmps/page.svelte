<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { IPage, IPara, KEYINDEXREG } from "orbe-common";
  import { Page } from "../srv/files";
  import Btn from "./btn.svelte";
  import ok from "../imgs/ok.svg";
  import cancel from "../imgs/cancel.svg";
  import save from "../imgs/save.svg";
  import delbin from "../imgs/delete.svg";
  import edit from "../imgs/edit.svg";
  import { INDEX } from "../helpers/keyIndex";
  import Editor from "./Editor.svelte";

  let editor: any;
  let editKeys = false;
  let oldKeys: string[];
  let curPage: IPage | undefined;
  let initialTitle: string;
  let content: string = "";
  let renaming = false;

  $: if(content) console.log('page content')

  function openPage(evt) {
    if (evt.detail.page) {
      Page.get(evt.detail.type, evt.detail.page).then((p: IPage) => {
        curPage = p;
        content = p.content
          .map((p: IPara) => {
            const style = p.style ? p.style : "p";
            return `<${style}>${p.para
              .split("\n")
              .map((p) => {
                const idx = INDEX.parse(p);
                if (idx.length == 0) return p;
                else {
                  idx.sort((a, b) => {
                    if (a.offset == b.offset) return b.end - a.end;
                    return a.offset - b.offset;
                  });
                  let str = "";
                  let last = 0;
                  for (const i of idx) {
                    if (i.offset < last) continue; //ignore overlap
                    if (i.offset > last) str += p.substring(last, i.offset);
                    str +=
                      `<b class='lnk' ref='${i.link.join("|")}'>` +
                      p.substring(i.offset, i.end) +
                      "</b>";
                    last = i.end;
                  }
                  if (last < p.length) str += p.substring(last);
                  return str;
                }
              })
              .map((s) => {
                return s.replaceAll(/http\S+/g, (match) => {
                  console.log(match);
                  return `<a href="${match}">${match}</a>`;
                });
              })
              .join("<br/>")}</${style}>`;
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
    oldKeys = curPage ? curPage.keys.map((s) => s) : [];
  }
  let dirty = false;

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
      .replaceAll(/\<\/?[ba][^\>]*\>/gi, "")
      .match(
        /(?<precont>[^\>\<]*)(\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>)?/gi
      )
      .map((l) => {
        const m = l.match(
          /(?<precont>[^\>\<]*)(\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>)?/i
        );
        return {
          style: m.groups.tag == "div" ? "p" : m.groups.tag,
          para:
            (m.groups.precont ? m.groups.precont : "") +
            (m.groups.content ? m.groups.content : ""),
        };
      });
    curPage.content = paras;
    INDEX.replace(
      curPage.type + "/" + curPage.name,
      oldKeys.map((k) => k.split(" ")),
      curPage.keys.map((k) => k.split(" "))
    );
    oldKeys = curPage.keys.map((s) => s);
    if (curPage.name) {
      Page.save(curPage).then(() => {
        dirty = false;
        console.log(id, evt);
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
      ? edKeys
          .replaceAll("\n", "")
          .replaceAll(/\<br\/?\>/gi, "")
          .match(
            /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/gi
          )
          .map((l) => {
            console.log("1", l);
            const m = l.match(
              /(?<precont>[^\>\<]*)\<(?<tag>\w+)\>(?<content>[^\>\<]*)\<\/\k<tag>\>/i
            );
            return (m.groups.precont ? m.groups.precont : "") + m.groups.content
              ? m.groups.content
              : "";
          })
          .map((l) => {
            console.log("2", l);
            let m;
            let resp = [];
            while ((m = KEYINDEXREG.exec(l)) != null) {
              console.log(m);
              if (m.groups.ok) resp.push(m[0]);
            }
            return resp.join(" ");
          })
      : [];
    curPage.keys = kk.filter((d) => d > "");
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
    <Editor bind:editorEvent={editor} bind:content bind:dirty />
    <div id="foot">
      {#if dirty}
        <Btn action={doSave} img={save} cls="btnsvg cmd" />
      {/if}
    </div>
  {/if}
</div>

<style>
  #keys {
    width: 80%;
  }
  #foot {
    min-height: 30px;
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

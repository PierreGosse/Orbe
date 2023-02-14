<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { IPage, IPara, KEYINDEXREG } from "orbe-common";
  import { Page } from "../srv/files";
  import Btn from "./btn.svelte";
  import save from "../imgs/save.svg";
  import delbin from "../imgs/delete.svg";
  import edit from "../imgs/edit.svg";
  import { INDEX } from "../helpers/keyIndex";
  import Editor from "./Editor.svelte";
  import { notifications } from "../helpers/notifications";
  import CmpKey from "./cmpKey.svelte";
  import Keywords from "./Keywords.svelte";

  let editor: any;
  let oldKeys: string[];
  let curPage: IPage | undefined;
  let initialTitle: string;
  let content: string = "";
  let renaming = false;
  let dildo: boolean;
  $: if (content) dildo = !dildo;
  let tryCnt = 0;
  function openPage(evt) {
    if (dirty && tryCnt++ < 2) {
      notifications.danger("Page non sauvegardée !");
      return;
    }
    tryCnt = 0;
    if (evt.detail.page) {
      window.dispatchEvent(new CustomEvent("StructLoading"));
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
                  return `<a href="${match}">${match}</a>`;
                });
              })
              .join("<br/>")}</${style}>`;
          })
          .join("\n");
        initialTitle = curPage.name;
        dirty = false;
        renaming = false;
        window.dispatchEvent(new CustomEvent("StructLoadStop"));
        notifications.success(evt.detail.type + " " + evt.detail.page);
      });
    } else {
      curPage = {
        type: evt.detail.type,
        name: "",
        keys: [],
        content: [],
      };
      initialTitle = "";
      renaming = true;
      content = "";
      dirty = false;
      if (editor) editor.refresh();
      notifications.success("Nouvelle page " + evt.detail.type);
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

  function doSave() {
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
    renaming = false;
    INDEX.replace(
      curPage.type + "/" + curPage.name,
      oldKeys.map((k) => k.split(" ")),
      curPage.keys.map((k) => k.split(" "))
    );
    oldKeys = curPage.keys.map((s) => s);
    if (curPage.name) {
      Page.save(curPage).then(() => {
        dirty = false;
      });
    }
    notifications.success(curPage.type + " " + curPage.name + " enregistré");
  }
  function doDelete(id, evt) {
    console.log(id, evt);
  }
</script>

<div class="main">
  <CmpKey ctrl key="s" action={doSave} />
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
    <Keywords bind:keys={curPage.keys} bind:dirty />
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
  /*#keys {
    width: 80%;
  }*/
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

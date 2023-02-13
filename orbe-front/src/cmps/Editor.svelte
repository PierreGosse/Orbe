<script lang="ts">
  import {
    buildTextNode,
    buildDivNode,
    hasFlatChild,
    flatten,
  } from "../helpers/sanitize";
  import { onMount, onDestroy } from "svelte";

  import Btn from "./btn.svelte";

  export let dirty: boolean;
  export let content: string;
  export const editorEvent = {
    refresh() {
      //  normalizeEdit();
    },
  };
  let divrul: HTMLDivElement[] = [];
  let divedit: HTMLDivElement;
  let eMenu: HTMLDivElement;

  let idSel: string;

  $: if (content && divedit) {
    console.log("editor content");
    window.setTimeout(normalizeEdit, 100);
  }

  onMount(() => {
    window.addEventListener("click", follow);
    // window.addEventListener("editorrefresh", normalizeEdit);
  });

  onDestroy(() => {
    window.removeEventListener("click", follow);
    // window.removeEventListener("editorrefresh", normalizeEdit);
  });

  function rulerHover(e: MouseEvent) {
    console.log(e.target);
    idSel = (e.target as HTMLElement).attributes.getNamedItem("idx").value;
    eMenu.style.display = "block";
    eMenu.style.top = "" + (e.target as HTMLElement).offsetTop + "px";
    eMenu.style.left = "" + (e.target as HTMLElement).offsetLeft + "px";
  }
  function menuOff(e: MouseEvent) {
    eMenu.style.display = "none";
    console.log(idSel);
  }
  function refreshRuler() {
    for (let i = 0; i < divedit.childNodes.length; i++) {
      const c = divedit.childNodes[i];
      if (!divrul[i])
        divrul[i] = document.createElement("div") as HTMLDivElement;
      const r = divrul[i];
      r.setAttribute("idx", "" + i);
      r.onmouseover = rulerHover;
      r.style.position = "absolute";
      r.style.zIndex = "10";
      r.style.top = "" + (c as HTMLElement).offsetTop + "px";
      r.style.left = "" + (divedit.offsetLeft - 20) + "px";
      r.innerText = c.nodeName;
      r.style.display =
        c.nodeName == "BR" || c.nodeName == "#text" ? "none" : "block";
      divedit.parentNode.appendChild(r);
    }
    while (divrul.length > divedit.childNodes.length) {
      divrul.splice(divrul.length - 1, 1)[0].remove();
    }
    console.log(divrul)
  }
  function normalizeEdit() {
    console.log("normalizeEdit");
    const todo: Node[][] = [];
    for (let i = 0; i < divedit.childNodes.length; i++) {
      const c = divedit.childNodes[i];
      switch (c.nodeName.toLocaleLowerCase()) {
        case "#text":
          const ptxt = buildTextNode(c.textContent);
          divedit.insertBefore(ptxt, c);
          divedit.removeChild(c);
          break;
        case "div":
          if (hasFlatChild(c)) {
            const sub = flatten(c as HTMLDivElement);
            todo.push([c, ...sub]);
          } else {
            const pdiv = buildDivNode((c as HTMLDivElement).innerHTML);
            divedit.insertBefore(pdiv, c);
            divedit.removeChild(c);
          }
          break;
      }
      if (window.getSelection().anchorNode == divedit) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        if (divedit.hasChildNodes()) {
          console.log(divedit.lastChild);
          console.log(divedit.lastChild.textContent);
          console.log(divedit.lastChild.textContent.length);
          let cur = divedit.lastChild;
          while (cur.nodeName != "#text" && cur.lastChild) cur = cur.lastChild;
          range.setStart(cur, cur.textContent.length);
        } else range.selectNode(divedit);
        window.getSelection().addRange(range);
      }
    }
    for (const td of todo) {
      console.log(td);
      for (let i = 1; i < td.length; i++) divedit.insertBefore(td[i], td[0]);
      divedit.removeChild(td[0]);
    }
    refreshRuler();
  }
  function onChange() {
    dirty = true;
  }
  function onPaste(evt: ClipboardEvent) {
    evt.preventDefault();
    const pData = JSON.stringify(
      evt.clipboardData.getData("text/html"),
      null,
      2
    );
    const sData = pData
      .replace(/^"/, "")
      .replace(/"$/, "")
      .replace(/\\n/g, "\n")
      .replace(/\<\!--((?!--\>).)*--\>/g, "")
      .replace(/\<\/?(?!div|p|br|h[1-6])[a-z][\-\w]*(\s[^\>]*)?\>/gi, "")
      .replace(/\<(?<tag>div|p|h[1-6]|br)[^\>]*\>/gi, "<$<tag>>")
      .replace(/^\s+/, "")
      .replace(/\s+$/, "");

    var el = document.createElement("div");
    el.innerHTML = sData;
    const sel = window.getSelection();
    sel.deleteFromDocument();
    const range = sel.getRangeAt(0);
    let frag = document.createDocumentFragment();
    let node;
    let lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    normalizeEdit();
  }
  function stylePara(id, e) {}
  function follow(evt) {
    if (divedit && divedit.contains(evt.target) && evt.target.attributes.ref) {
      console.log(evt.target.attributes.ref.value);
      const vv = evt.target.attributes.ref.value.split("|");
      const ll = vv[0].split("/");
      if (ll.length == 2)
        window.dispatchEvent(
          new CustomEvent("openPage", { detail: { type: ll[0], page: ll[1] } })
        );
    }
  }
</script>

<div>
  <div
    contenteditable="true"
    on:paste={onPaste}
    on:input={onChange}
    bind:innerHTML={content}
    bind:this={divedit}
  />
  <div id="editormenu" on:mouseleave={menuOff} bind:this={eMenu}>
    <Btn txt="H1" id="h1" action={stylePara} />
    <Btn txt="H2" id="h2" action={stylePara} />
    <Btn txt="H3" id="h3" action={stylePara} />
    <Btn txt="H4" id="h4" action={stylePara} />
    <Btn txt="H5" id="h5" action={stylePara} />
    <Btn txt="H6" id="h6" action={stylePara} />
    <Btn txt="P" id="p" action={stylePara} />
  </div>
</div>

<style>
  #editormenu {
    position: absolute;
    z-index: 20;
    display: none;
    background-color: rgb(172, 172, 172);
    border: 1px solid rgb(49, 49, 49);
    padding: 3px;
  }
  [contenteditable] {
    width: 100%;
    border: 1px solid lightblue;
    padding: 5px;
  }
  :global(h1 h2 h3 h4 h5 h6){
    margin: 5px 2px 5px 2px;
  }
  :global(p) {
    margin: 2px;
  }
</style>

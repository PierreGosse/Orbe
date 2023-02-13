export function cleanHtml(input: string) {
  console.log(input)
  return input.replace(/\n/g, "")
    .replace(/\<br\/?\>/gi, "\n")
    .replace(/\<\/?(?!div|p|br)[a-zA-Z]+(\s[^\>]*)?\>/gi, "")
}

export function buildTextNode(txt: string): HTMLParagraphElement {
  const p = document.createElement("p");
  p.innerText = txt;
  return p;
}
export function buildDivNode(html: string): HTMLParagraphElement {
  const p = document.createElement("p");
  p.innerHTML = html;
  return p;
}
export function hasFlatChild(div: Node) {
  console.log("hasFlatChild", div);
  const cs = (div as HTMLDivElement).children;
  for (let i=0; i<cs.length;i++) {
    if (cs[i].tagName.match(/div|p|h[1-6]/i)) return true;
  }
  return false;
}
export function flatten(div: HTMLDivElement): Node[] {
  console.log("flatten", div);
  const resp: Node[] = [];
  for (let i = 0; i < div.childNodes.length; i++) {
    const c = div.childNodes[i];
    if (c.nodeName.match(/div/i)) {
      const sub = flatten(c as HTMLDivElement);
      for (const s of sub) resp.push(s);
    } else resp.push(c);
  }
  console.log(resp);
  return resp;
}
interface IIndexNode {
  next: { [key: string]: IIndexNode }
  res?: string
}
interface IParseNode extends IIndexNode{
  offset
}
export const KeyIndex = (() => {
  const index: IIndexNode = { next: {} }
  return {
    load: (rules: string[]) => {
      for (const sreg of rules) {
        const reg = sreg.split('\t')
        const toks = reg[0].split(' ')
        let cur = index
        for (let i = 0; i < toks.length; i++) {
          if (!cur.next[toks[i]])
            cur.next[toks[i]] = { next: {} }
          cur = cur.next[toks[i]]
        }
        cur.res = reg[1]
      }
    },
    replace: (link, oldKeys: string[], newKeys: string[]) => {
      for(const oK of oldKeys){
        const toks = oK.split(' ')

      }
    },
    parse: (str: string) => {
      const m = str.matchAll(/[a-zA-Z\u00C0-\u024F0-9]+/g)
      let mc
      let resp = []
      let parsing: IIndexNode[] = []
      while ((mc = m.next())) {
        if (mc.done)
          break
        let newPars: IIndexNode[] = []
        for (const p of parsing) {
          if (p.next[mc.value])
            newPars.push(p.next[mc.value])
        }
        if (index.next[mc.value])
          newPars.push(index.next[mc.value])
      }
    },
    getIndex: () => {
      return index
    }
  }
})()
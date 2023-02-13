export interface IIndexRule {
  keys: string[]
  link: string[]
}
export interface IIndexNode {
  next: { [key: string]: IIndexNode }
  res?: string[]
}
export interface IParseNode extends IIndexNode {
  offset: number
  end: number
}
export interface IParseResult {
  offset: number
  end: number
  link: string[]
}

export const KEYINDEXREG = /(?<ok>[a-zA-Z\u00C0-\u024F0-9\-_]+)|(?<ko>[^\sa-zA-Z\u00C0-\u024F0-9\-_]+)/g

export class KeyIndex {
  index: IIndexNode = { next: {} }
  findNode(keys: string[]): IIndexNode {
    let cur = this.index
    for (let i = 0; i < keys.length; i++) {
      if (!cur.next[keys[i]])
        cur.next[keys[i]] = { next: {} }
      cur = cur.next[keys[i]]
    }
    return cur
  }
  loadRule(sreg: IIndexRule) {
    let cur = this.findNode(sreg.keys)
    cur.res = sreg.link
  }
  load(rules: IIndexRule[]) {
    for (const sreg of rules) this.loadRule(sreg)
  }
  serialize(): IIndexRule[] {
    const resp: IIndexRule[] = []
    this.addLevel(resp, this.index, [])
    return resp
  }
  addLevel(resp: IIndexRule[], cur: IIndexNode, path: string[]) {
    console.log('addLevel', resp, cur, path)
    if (cur.res)
      resp.push({ link: cur.res, keys: path })
    for (const n in cur.next) {
      this.addLevel(resp, cur.next[n], [...path, n])
    }
    console.log('out', resp)
  }
  replace(link: string, oldKeys: string[][], newKeys: string[][]) {
    for (const oK of oldKeys) {
      let cur = this.findNode(oK)
      const idx = cur.res ? cur.res.indexOf(link) : -1
      if (idx > -1)
        cur.res?.splice(idx, 1)
      if (cur.res?.length == 0)
        delete cur.res
    }
    for (const nK of newKeys) {
      let cur = this.findNode(nK)
      if (cur.res) cur.res.push(link)
      else cur.res = [link]
    }
  }
  parse(str: string) {
    let rs;
    let resp: IParseResult[] = []
    let parsing: IParseNode[] = []
    while ((rs = KEYINDEXREG.exec(str)) != null) {
      let newPars: IParseNode[] = []
      if (rs.groups!['ok']) {
        for (const p of parsing) {
          if (p.next[rs[0]])
            newPars.push({ offset: p.offset, end: rs.index + rs[0].length, ...p.next[rs[0]] })
        }
        if (this.index.next[rs[0]])
          newPars.push({ offset: rs.index, end: rs.index + rs[0].length, ...this.index.next[rs[0]] })
        for (const np of newPars)
          if (np.res)
            resp.push({ offset: np.offset, end: np.end, link: np.res })
      }
      parsing = newPars
    }
    return resp
  }
  getIndex() {
    return this.index
  }

}
import { Files } from "../srv/files"


export class Index {
  index: any = {}
  serialize(): string {
    let ret = ""
    for (const k in this.index)
      ret += k + "\t" + this.index[k] + "\n"
    return ret
  }
  addEntry(key: string, path: string) {
    const k = key.replace(/\s+/g, ' ').trim()
    if (this.index[k] && this.index[k] !== path)
      throw new Error('duplicate')
    else
      this.index[k] = path
  }
  getEntry(key: string) {
    return this.index[key]
  }

  static parse(lines: string[]): Index {
    const ret = new Index()
    for (const l in lines) {
      const idx = l.indexOf('\t')
      ret.index[l.slice(0, idx)] = l.slice(idx + 1)
    }
    return ret
  }
  static replace(link: string, oldKeys: string[], newKeys: string[]) {
    const index = this.parse(Files.getInstance().readIndex())
    const dkeys = [];
    for (const l of oldKeys) {
      dkeys.push(l.replace(/\s+/g, ' ').trim())
    }
    for (const l of newKeys) {
      const k = l.replace(/\s+/g, ' ').trim()
      const del = dkeys.indexOf(k)
      if (del > -1)
        dkeys.splice(del, 1)
      index.index[k] = link
    }
    for (const k of dkeys) {
      delete index.index[k]
    }
  }
}
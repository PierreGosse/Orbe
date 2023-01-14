
const KEY = '\tkeys'
const DATE = '\tdates'
const CONTENT = '\tcontent'
export class Page {
  constructor(private keys: string[] = [], private dates: string[] = [], private content: string = "") { }
  serialize(): string {
    let ret = `${KEY}\n`
    for (const k of this.keys) ret += k + '\n'
    ret += `${DATE}\n`
    for (const k of this.dates) ret += k + '\n'
    ret += `${CONTENT}\n` + this.content
    return ret
  }
  static parse(lines: string[]): Page {
    const ret = new Page()
    let state = 0
    for (const l of lines)
      if (l[0] == '\t') {
        if (l == KEY) state = 1
        if (l == DATE) state = 2
        if (l == CONTENT) state = 0
      }
      else
        switch (state) {
          case 0:
            ret.content += l + '\n'
            break;
          case 1:
            ret.keys.push(l)
            break;
          case 2:
            ret.dates.push(l)
        }
    return ret
  }
}
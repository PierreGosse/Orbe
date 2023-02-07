import fs from 'fs'
import path from 'path'
import { IStructure, IPage, IPara } from 'orbe-common'

export class Files {
  static instance: Files
  static getInstance() {
    if (!this.instance)
      this.instance = new Files()
    return this.instance
  }

  structpath: string
  contentpath: string
  indexpath: string
  constructor() {
    if (!fs.existsSync(process.env.ROOTPATH as string))
      fs.mkdirSync(process.env.ROOTPATH as string)
    this.structpath = path.join(process.env.ROOTPATH as string, 'struct')
    this.contentpath = path.join(process.env.ROOTPATH as string, 'content')
    this.indexpath = path.join(process.env.ROOTPATH as string, 'idx')
    if (!fs.existsSync(this.structpath))
      fs.mkdirSync(this.structpath)
    if (!fs.existsSync(this.contentpath))
      fs.mkdirSync(this.contentpath)
    if (!fs.existsSync(this.indexpath))
      fs.mkdirSync(this.indexpath)
  }
  getStruct(): IStructure {
    const rootStruct = path.join(this.structpath, 'root')
    if (!fs.existsSync(rootStruct))
      return { types: [] }
    else
      return { types: fs.readFileSync(rootStruct).toString().split('\n') }
  }
  writeStruct(struct: IStructure) {
    const rootStruct = path.join(this.structpath, 'root')
    fs.writeFileSync(rootStruct, struct.types.join('\n'))
  }
  addStruct(name: string): IStructure {
    const tps = this.getStruct()
    tps.types.push(name)
    this.writeStruct(tps)
    return tps
  }
  delStruct(name: string) {
    const spath = path.join(this.contentpath, name)
    console.log(spath)
    if (fs.existsSync(spath)) {
      const dd = fs.opendirSync(spath)
      if (dd.readSync())
        throw new Error('not empty')
      fs.rmdirSync(spath)
    }
    const tt = this.getStruct()
    tt.types.splice(tt.types.indexOf(name), 1)
    this.writeStruct(tt)
    return tt
  }
  listPages(type: string): string[] {
    const resp: string[] = []
    const spath = path.join(this.contentpath, type)
    if (fs.existsSync(spath)) {
      const dd = fs.opendirSync(spath)
      let f
      while ((f = dd.readSync()) != null)
        resp.push(f.name);
    }
    return resp
  }
  getPage(type: string, name: string): IPage {
    console.log("getPage", type, name)
    const str = this.getContent(type, name)
    const res: IPage = {
      type,
      name,
      keys: [],
      content: []
    }
    if (str) {
      const tstr = str.split('\r\n')
      let state = 0
      for (const l of tstr) {
        console.log(l,state)
        switch (state) {
          case 0:
            if (l.startsWith('\0'))
              state = getState(l)
            else {
              const idx = l.indexOf('\b')
              console.log(idx)
              res.content.push({
                style: idx > 0 ? l.slice(0, idx) : "",
                para: idx > 0 ? l.slice(idx+1) : l
              })
            }
            break;
          case 1:
            if (l.startsWith('\0'))
              state = getState(l)
            else res.keys.push(l)
        }
      }
    }
    console.log(res)
    return res
  }
  savePage(page: IPage) {
    console.log('save', page)
    const str = "\0KEYS\r\n" + page.keys.map((s: string) => s.trim()).join('\r\n')
      + "\r\n\0CONTENT\r\n" + page.content.map((s: IPara) => (s.style ? s.style : "") + '\b' + s.para).join('\r\n')
    this.writeContent(page.type, page.name, str)
  }
  getContent(type: string, name: string): string {
    const cpath = path.join(this.contentpath, type, name)
    if (!fs.existsSync(cpath))
      return ''
    else
      return fs.readFileSync(cpath).toString()
  }
  writeContent(type: string, name: string, content: string) {
    console.log(type, name, content)
    const tpath = path.join(this.contentpath, type)
    console.log(tpath)
    if (!fs.existsSync(tpath))
      fs.mkdirSync(tpath)
    const cpath = path.join(tpath, name)
    console.log(cpath)
    fs.writeFileSync(cpath, content)
  }
}

function getState(str: string): number {
  if (str == '\0KEYS')
    return 1
  return 0
}
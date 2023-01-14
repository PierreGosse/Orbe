import fs from 'fs'
import path from 'path'
import { IStructure } from 'orbe-common'

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
    fs.writeFileSync(rootStruct, JSON.stringify(struct))
  }
  getContent(type: string, name: string): string {
    const cpath = path.join(this.contentpath, type, name)
    if (!fs.existsSync(cpath))
      return ''
    else
      return fs.readFileSync(cpath).toString()
  }
  writeContent(type: string, name: string, content: string) {
    const tpath = path.join(this.contentpath, type)
    if (!fs.existsSync(tpath))
      fs.mkdirSync(tpath)
    const cpath = path.join(tpath, name)
    fs.writeFileSync(cpath, content)
  }
}

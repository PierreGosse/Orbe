import express from 'express'
import { KeyIndex } from 'orbe-common'
import { Index } from '../mdl'
import { Files } from '../srv/files'

export const Page = express.Router()

Page.post('/', (req, res) => {
  const rr = Files.getInstance().getPage(req.body.struct, req.body.page)
  res.send(rr)
})

Page.post('/save', (req, res) => {
  const old = Files.getInstance().getPage(req.body.type, req.body.name)
  console.log(old, req.body.keys)
  if (JSON.stringify(old.keys) != JSON.stringify(req.body.keys)) {
    const kIndex = new KeyIndex()
    kIndex.load(Files.getInstance().readRules())
    kIndex.replace(req.body.type + "/" + req.body.name, old.keys.map((k: string) => k.split(' ')), req.body.keys.map((k: string) => k.split(' ')))
    Files.getInstance().writeRules(kIndex.serialize())
  }
  Files.getInstance().savePage(req.body)
  res.send({})
})

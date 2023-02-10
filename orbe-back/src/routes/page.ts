import express from 'express'
import { Index } from '../mdl'
import { Files } from '../srv/files'

export const Page = express.Router()

Page.post('/', (req, res) => {
  const rr = Files.getInstance().getPage(req.body.struct, req.body.page)
  res.send(rr)
})

Page.post('/save', (req, res) => {
  const old = Files.getInstance().getPage(req.body.type, req.body.name)
  if (JSON.stringify(old.keys) != JSON.stringify(req.body.keys)) {
    Index.replace(req.body.type + "/" + req.body.name, old.keys, req.body.keys)
  }
  Files.getInstance().savePage(req.body)
  res.send({})
})

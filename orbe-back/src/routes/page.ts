import express from 'express'
import { Files } from '../srv/files'

export const Page = express.Router()

Page.post('/', (req, res) => {
  const rr = Files.getInstance().getPage(req.body.struct, req.body.page)
  res.send(rr)
})

Page.post('/save', (req, res) => {
  const rr = Files.getInstance().savePage(req.body)
})

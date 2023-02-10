import express from 'express'
import { Index } from '../mdl'
import { Files } from '../srv/files'

export const KeyIndex = express.Router()

KeyIndex.post('/:action', (req, res) => {
  switch (req.params.action) {
    case 'replace':
      break;
    default:
      throw new Error('Unknown action ' + req.params.action)
  }
})

KeyIndex.get('/', (req, res) => {
  const rr = Files.getInstance().readRules()
  res.send(rr)
})
KeyIndex.put('/', (req, res) => {
  const rr = Files.getInstance().writeRules(req.body)
  res.send(rr)
})


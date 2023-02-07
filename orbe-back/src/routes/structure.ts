import express from 'express'
import { Files } from '../srv/files'

export const Struct = express.Router()

Struct.post('/list', (req, res) => {
  const rr = Files.getInstance().listPages(req.body.name)
  res.send(rr)
})
Struct.post('/add', (req, res) => {
  try {
    res.send(Files.getInstance().addStruct(req.body.name))
  }
  catch (err) {
    res.status(403).send({ error: 'could not add' })
  }
})
Struct.post('/del', (req, res) => {
  const tps = Files.getInstance().getStruct()
  const name = req.body.name
  console.log(name, tps)
  try {
    if (name && tps.types.indexOf(name) > -1) {
      res.send(Files.getInstance().delStruct(name))
    } else {
      res.status(403).send({ error: 'could not delete' })
    }
  } catch (err) {
    res.status(500).send({ error: 'could not delete' })
  }
})
Struct.get('/', (req, res) => {
  const rr = Files.getInstance().getStruct()
  res.send(rr)
})

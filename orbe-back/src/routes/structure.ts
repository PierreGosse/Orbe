import express from 'express'
import { Files } from '../srv/files'

export const Struct = express.Router()

Struct.get('/', (req, res) => {
  console.log('getstruct')
  res.send(Files.getInstance().getStruct())
})
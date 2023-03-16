import dotenv from 'dotenv';
import { KeyIndex } from 'orbe-common';

import { Files } from '../src/srv/files'

dotenv.config()

const fls = Files.getInstance()
const index = new KeyIndex()
for (const struct of fls.getStruct().types) {
  for (const name of fls.listPages(struct)) {
    const page = fls.getPage(struct, name)
    const ks = page.keys.filter(k => k > "")
    for(const k of ks)
      index.loadRule({ link: [struct + "/" + name], keys: k.split(' ') })
  }
}
const ser = index.serialize()
fls.writeRules(ser)

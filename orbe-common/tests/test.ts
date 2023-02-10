import { IIndexRule, KeyIndex } from '../src/lib/keyIndex'
const keyIndex = new KeyIndex()
const rules: IIndexRule[] = [
  {
    keys: ["toto", "est"],
    link: "link1"
  },
  {
    keys: ["145"],
    link: "link2"
  },
  {
    keys: ["toto", "est", "bô"],
    link: "link3"
  },
  { keys: ["145", "146"], link: "link4" }
]
keyIndex.load(rules)
console.log(JSON.stringify(keyIndex.getIndex(), null, 2))
const str = "toto est bô c14 et 145. 146 aussi"
console.log(keyIndex.parse(str))
const reg = /(?<ok>[a-zA-Z\u00C0-\u024F0-9]+)|(?<ko>[^\sa-zA-Z\u00C0-\u024F0-9]+)/g
let rs;
while ((rs = reg.exec(str)) != null)
  console.log(rs)


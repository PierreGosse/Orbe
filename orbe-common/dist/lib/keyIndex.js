"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyIndex = void 0;
class KeyIndex {
    constructor() {
        this.index = { next: {} };
    }
    findNode(keys) {
        let cur = this.index;
        for (let i = 0; i < keys.length; i++) {
            if (!cur.next[keys[i]])
                cur.next[keys[i]] = { next: {} };
            cur = cur.next[keys[i]];
        }
        return cur;
    }
    load(rules) {
        for (const sreg of rules) {
            let cur = this.findNode(sreg.keys);
            cur.res = sreg.link;
        }
    }
    replace(link, oldKeys, newKeys) {
        for (const oK of oldKeys) {
            let cur = this.findNode(oK);
            delete cur.res;
        }
        for (const nK of newKeys) {
            let cur = this.findNode(nK);
            cur.res = link;
        }
    }
    parse(str) {
        const reg = /(?<ok>[a-zA-Z\u00C0-\u024F0-9]+)|(?<ko>[^\sa-zA-Z\u00C0-\u024F0-9]+)/g;
        let rs;
        let resp = [];
        let parsing = [];
        while ((rs = reg.exec(str)) != null) {
            let newPars = [];
            if (rs.groups['ok'])
                for (const p of parsing) {
                    if (p.next[rs[0]])
                        newPars.push(Object.assign({ offset: p.offset, end: rs.index + rs[0].length }, p.next[rs[0]]));
                }
            if (this.index.next[rs[0]])
                newPars.push(Object.assign({ offset: rs.index, end: rs.index + rs[0].length }, this.index.next[rs[0]]));
            for (const np of newPars)
                if (np.res)
                    resp.push({ offset: np.offset, end: np.end, link: np.res });
            parsing = newPars;
        }
        return resp;
    }
    getIndex() {
        return this.index;
    }
}
exports.KeyIndex = KeyIndex;

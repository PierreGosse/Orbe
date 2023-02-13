"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyIndex = exports.KEYINDEXREG = void 0;
exports.KEYINDEXREG = /(?<ok>[a-zA-Z\u00C0-\u024F0-9\-_]+)|(?<ko>[^\sa-zA-Z\u00C0-\u024F0-9\-_]+)/g;
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
    loadRule(sreg) {
        let cur = this.findNode(sreg.keys);
        cur.res = sreg.link;
    }
    load(rules) {
        for (const sreg of rules)
            this.loadRule(sreg);
    }
    serialize() {
        const resp = [];
        this.addLevel(resp, this.index, []);
        return resp;
    }
    addLevel(resp, cur, path) {
        console.log('addLevel', resp, cur, path);
        if (cur.res)
            resp.push({ link: cur.res, keys: path });
        for (const n in cur.next) {
            this.addLevel(resp, cur.next[n], [...path, n]);
        }
        console.log('out', resp);
    }
    replace(link, oldKeys, newKeys) {
        var _a, _b;
        for (const oK of oldKeys) {
            let cur = this.findNode(oK);
            const idx = cur.res ? cur.res.indexOf(link) : -1;
            if (idx > -1)
                (_a = cur.res) === null || _a === void 0 ? void 0 : _a.splice(idx, 1);
            if (((_b = cur.res) === null || _b === void 0 ? void 0 : _b.length) == 0)
                delete cur.res;
        }
        for (const nK of newKeys) {
            let cur = this.findNode(nK);
            if (cur.res)
                cur.res.push(link);
            else
                cur.res = [link];
        }
    }
    parse(str) {
        let rs;
        let resp = [];
        let parsing = [];
        while ((rs = exports.KEYINDEXREG.exec(str)) != null) {
            let newPars = [];
            if (rs.groups['ok']) {
                for (const p of parsing) {
                    if (p.next[rs[0]])
                        newPars.push(Object.assign({ offset: p.offset, end: rs.index + rs[0].length }, p.next[rs[0]]));
                }
                if (this.index.next[rs[0]])
                    newPars.push(Object.assign({ offset: rs.index, end: rs.index + rs[0].length }, this.index.next[rs[0]]));
                for (const np of newPars)
                    if (np.res)
                        resp.push({ offset: np.offset, end: np.end, link: np.res });
            }
            parsing = newPars;
        }
        return resp;
    }
    getIndex() {
        return this.index;
    }
}
exports.KeyIndex = KeyIndex;

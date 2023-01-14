"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
class Index {
    constructor() {
        this.index = {};
    }
    serialize() {
        let ret = "";
        for (const k in this.index)
            ret += k + "\t" + this.index[k] + "\n";
        return ret;
    }
    addEntry(key, path) {
        const k = key.replace(/\s/g, ' ').trim();
        if (this.index[k] && this.index[k] !== path)
            throw new Error('duplicate');
        else
            this.index[k] = path;
    }
    getEntry(key) {
        return this.index[key];
    }
    static parse(lines) {
        const ret = new Index();
        for (const l in lines) {
            const idx = l.indexOf('\t');
            ret.index[l.slice(0, idx)] = l.slice(idx + 1);
        }
        return ret;
    }
}
exports.Index = Index;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Files {
    static getInstance() {
        if (!this.instance)
            this.instance = new Files();
        return this.instance;
    }
    constructor() {
        if (!fs_1.default.existsSync(process.env.ROOTPATH))
            fs_1.default.mkdirSync(process.env.ROOTPATH);
        this.structpath = path_1.default.join(process.env.ROOTPATH, 'struct');
        this.contentpath = path_1.default.join(process.env.ROOTPATH, 'content');
        this.indexpath = path_1.default.join(process.env.ROOTPATH, 'idx');
        if (!fs_1.default.existsSync(this.structpath))
            fs_1.default.mkdirSync(this.structpath);
        if (!fs_1.default.existsSync(this.contentpath))
            fs_1.default.mkdirSync(this.contentpath);
        if (!fs_1.default.existsSync(this.indexpath))
            fs_1.default.mkdirSync(this.indexpath);
    }
    getStruct() {
        const rootStruct = path_1.default.join(this.structpath, 'root');
        if (!fs_1.default.existsSync(rootStruct))
            return { types: [] };
        else
            return { types: fs_1.default.readFileSync(rootStruct).toString().split('\n') };
    }
    writeStruct(struct) {
        const rootStruct = path_1.default.join(this.structpath, 'root');
        fs_1.default.writeFileSync(rootStruct, JSON.stringify(struct));
    }
    getContent(type, name) {
        const cpath = path_1.default.join(this.contentpath, type, name);
        if (!fs_1.default.existsSync(cpath))
            return '';
        else
            return fs_1.default.readFileSync(cpath).toString();
    }
    writeContent(type, name, content) {
        const tpath = path_1.default.join(this.contentpath, type);
        if (!fs_1.default.existsSync(tpath))
            fs_1.default.mkdirSync(tpath);
        const cpath = path_1.default.join(tpath, name);
        fs_1.default.writeFileSync(cpath, content);
    }
}
exports.Files = Files;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitClient = void 0;
const simple_git_1 = require("simple-git");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class GitClient {
    static getInstance() {
        if (!this.instance)
            this.instance = new GitClient();
        return this.instance;
    }
    constructor() {
        const options = {
            baseDir: path_1.default.join(process.env.ROOTPATH, 'git'),
            binary: 'git',
            maxConcurrentProcesses: 6,
            trimmed: false,
        };
        console.log(options);
        if (!fs_1.default.existsSync(options.baseDir))
            fs_1.default.mkdirSync(options.baseDir);
        this.git = (0, simple_git_1.simpleGit)(options);
    }
    async branches() {
        const options = {};
        console.log(await this.git.branch(options));
    }
    async commits(limit = 10, start = undefined) {
        const options = { maxcount: limit };
        if (start)
            options.to = start;
        console.log(await this.git.log(options));
    }
}
exports.GitClient = GitClient;

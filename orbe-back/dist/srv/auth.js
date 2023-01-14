"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.auth = exports.Auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const consts_1 = require("../consts");
class Auth {
    static getInstance() {
        if (!this.instance)
            this.instance = new Auth();
        return this.instance;
    }
    constructor() {
        if (!fs_1.default.existsSync(process.env.ROOTPATH))
            fs_1.default.mkdirSync(process.env.ROOTPATH);
        this.keypath = path_1.default.join(process.env.ROOTPATH, 'authkey');
        this.authpath = path_1.default.join(process.env.ROOTPATH, 'auth');
        if (!fs_1.default.existsSync(this.keypath))
            fs_1.default.mkdirSync(this.keypath);
        if (!fs_1.default.existsSync(this.authpath))
            fs_1.default.mkdirSync(this.authpath);
    }
    async login(login, password) {
        const authfile = path_1.default.join(this.authpath, login);
        if (fs_1.default.existsSync(authfile)) {
            const bf = fs_1.default.readFileSync(authfile);
            const encoded = await bcrypt_1.default.hash(password, consts_1.SALTROUNDS);
            if (bf.toString() === encoded) {
                const token = jsonwebtoken_1.default.sign({ user: login }, consts_1.SECRET, {
                    expiresIn: '2 days',
                });
                return token;
            }
        }
        throw new Error('Authentication refused');
    }
    async linklogin(key) {
        const keyfile = path_1.default.join(this.keypath, key);
        console.log(keyfile);
        if (fs_1.default.existsSync(keyfile)) {
            const token = fs_1.default.readFileSync(keyfile).toString();
            console.log(token);
            try {
                const decoded = jsonwebtoken_1.default.verify(token, consts_1.SECRET);
                console.log(decoded);
                return token;
            }
            catch (e) {
                fs_1.default.rmSync(keyfile);
                throw new Error('Invalid link');
            }
        }
        throw new Error('Invalid link');
    }
    async changePassword(login, password) {
        const authfile = path_1.default.join(this.authpath, login);
        const encoded = await bcrypt_1.default.hash(password, consts_1.SALTROUNDS);
        fs_1.default.writeFileSync(authfile, encoded);
    }
    async createUser(login) {
        const key = await bcrypt_1.default.hash(consts_1.SECRET + '_' + login + '_' + (new Date().getDate()), consts_1.SALTROUNDS);
        const keyfile = path_1.default.join(this.keypath, key);
        console.log(this.keypath);
        console.log(key);
        console.log(keyfile);
        const token = jsonwebtoken_1.default.sign({ user: login, resetpassword: true }, consts_1.SECRET, {
            expiresIn: '1 days',
        });
        fs_1.default.writeFileSync(keyfile, token);
        return key;
    }
}
exports.Auth = Auth;
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, consts_1.SECRET);
        req.token = decoded;
        next();
    }
    catch (err) {
        res.status(401).send('Please authenticate');
    }
};
exports.auth = auth;
const login = async (req, res) => {
    const login = req.body.login;
    const pass = req.body.password;
    try {
        res.send(await Auth.getInstance().login(login, pass));
    }
    catch (e) {
        res.sendStatus(401);
    }
};
exports.login = login;

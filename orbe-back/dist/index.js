"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const git_1 = require("./srv/git");
const auth_1 = require("./srv/auth");
const structure_1 = require("./routes/structure");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/struct', structure_1.Struct);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/init', async (req, res) => {
    await git_1.GitClient.getInstance().git.init();
    res.send('Ok');
});
app.get('/branch', async (req, res) => {
    await git_1.GitClient.getInstance().branches();
});
app.get('/log', async (req, res) => {
    await git_1.GitClient.getInstance().commits();
});
app.post('/login', async (req, res) => {
    try {
        res.send(await auth_1.Auth.getInstance().login(req.body.login, req.body.password));
    }
    catch (e) {
        res.sendStatus(401);
    }
});
app.get('/linklogin', async (req, res) => {
    try {
        res.send(auth_1.Auth.getInstance().linklogin(req.query.key));
    }
    catch (e) {
        res.sendStatus(401);
    }
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const express_1 = __importDefault(require("express"));
const files_1 = require("../srv/files");
exports.Struct = express_1.default.Router();
exports.Struct.get('/', (req, res) => {
    res.send(files_1.Files.getInstance().getStruct());
});

import dotenv from 'dotenv';
import { Auth } from '../src/srv/auth'
dotenv.config();

console.log(process.argv, process.env.ROOTPATH)

Auth.getInstance().createUser(process.argv[2]).then((key: string) => { console.log(key) })
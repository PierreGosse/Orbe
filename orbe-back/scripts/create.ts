import dotenv from 'dotenv';
import { Auth } from '../src/srv/auth'
dotenv.config();

Auth.getInstance().createUser(process.argv[2]).then((key: string) => { console.log(key) })
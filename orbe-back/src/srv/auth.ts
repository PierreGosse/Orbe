import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt';
import fs from 'fs'
import path from 'path'

import { SALTROUNDS, SECRET } from '../consts';

export interface AuthenticatedRequest extends Request {
  token: string | JwtPayload;
}

export class Auth {
  static instance: Auth
  static getInstance() {
    if (!this.instance)
      this.instance = new Auth()
    return this.instance
  }

  keypath: string
  authpath: string
  constructor() {
    if (!fs.existsSync(process.env.ROOTPATH as string))
      fs.mkdirSync(process.env.ROOTPATH as string)
    this.keypath = path.join(process.env.ROOTPATH as string, 'authkey')
    this.authpath = path.join(process.env.ROOTPATH as string, 'auth')
    if (!fs.existsSync(this.keypath))
      fs.mkdirSync(this.keypath)
    if (!fs.existsSync(this.authpath))
      fs.mkdirSync(this.authpath)
  }
  async login(login: string, password: string) {
    const authfile = path.join(this.authpath, login)
    if (fs.existsSync(authfile)) {
      const bf = fs.readFileSync(authfile)
      const encoded = await bcrypt.hash(password, SALTROUNDS)
      if (bf.toString() === encoded) {
        const token = jwt.sign({ user: login }, SECRET, {
          expiresIn: '2 days',
        });
        return token
      }

    }
    throw new Error('Authentication refused')
  }
  async linklogin(key: string) {
    const keyfile = path.join(this.keypath, key)
    console.log(keyfile)
    if (fs.existsSync(keyfile)) {
      const token = fs.readFileSync(keyfile).toString()
      console.log(token)
      try {
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded)
        return token
      }
      catch (e) {
        fs.rmSync(keyfile)
        throw new Error('Invalid link')
      }
    }
    throw new Error('Invalid link')
  }
  async changePassword(login: string, password: string) {
    const authfile = path.join(this.authpath, login)
    const encoded = await bcrypt.hash(password, SALTROUNDS)
    fs.writeFileSync(authfile, encoded)
  }
  async createUser(login: string) {
    const key = await bcrypt.hash(SECRET + '_' + login + '_' + (new Date().getDate()), SALTROUNDS)
    const keyfile = path.join(this.keypath, key)
    console.log(this.keypath)
    console.log(key)
    console.log(keyfile)
    const token = jwt.sign({ user: login, resetpassword: true }, SECRET, {
      expiresIn: '1 days',
    });
    fs.writeFileSync(keyfile, token)
    return key
  }
}
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET);
    (req as AuthenticatedRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
}


export const login = async (req: Request, res: Response) => {
  const login = req.body.login
  const pass = req.body.password
  try {
    res.send(await Auth.getInstance().login(login, pass))
  }
  catch (e) {
    res.sendStatus(401)
  }
}
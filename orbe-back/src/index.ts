import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import { GitClient } from './srv/git';
import { login, Auth } from './srv/auth';
import { Struct } from './routes/structure';
import { Page } from './routes/page';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/struct',Struct)
app.use('/page',Page)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/init', async (req: Request, res: Response) => {
  await GitClient.getInstance().git.init()
  res.send('Ok')
})

app.get('/branch', async (req: Request, res: Response) => {
  await GitClient.getInstance().branches()
})

app.get('/log', async (req: Request, res: Response) => {
  await GitClient.getInstance().commits()
})

app.post('/login', async (req: Request, res: Response) => {
  try {
    res.send(await Auth.getInstance().login(req.body.login, req.body.password))
  }
  catch (e) {
    res.sendStatus(401)
  }
})
app.get('/linklogin', async (req: Request, res: Response) => {
  try {
    res.send(Auth.getInstance().linklogin(req.query.key as string))
  } catch (e) {
    res.sendStatus(401)
  }
})
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
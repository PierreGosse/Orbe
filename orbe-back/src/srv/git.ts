import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git'
import fs from 'fs'
import path from 'path'

export class GitClient {
  static instance: GitClient
  static getInstance() {
    if (!this.instance)
      this.instance = new GitClient()
    return this.instance
  }
  git: SimpleGit
  constructor() {
    const options: Partial<SimpleGitOptions> = {
      baseDir: path.join(process.env.ROOTPATH as string, 'git'),
      binary: 'git',
      maxConcurrentProcesses: 6,
      trimmed: false,
    };

    console.log(options)
    if (!fs.existsSync(options.baseDir as string))
      fs.mkdirSync(options.baseDir as string)
    this.git = simpleGit(options);
  }
  async branches() {
    const options: any = {

    }
    console.log(await this.git.branch(options))
  }
  async commits(limit: number = 10, start: string | undefined = undefined) {
    const options: any = { maxcount: limit }
    if (start)
      options.to = start
    console.log(await this.git.log(options))
  }
}


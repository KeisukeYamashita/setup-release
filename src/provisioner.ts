import * as core from '@actions/core'

export interface Config {
  name: string
}

export class Provisioner {
  constructor(private cfg: Config) {}

  provision(folder: string): void {
    core.addPath(folder)
  }
}

export default {
  Provisioner
}

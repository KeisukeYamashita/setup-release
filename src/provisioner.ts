import * as core from '@actions/core'

export interface Config {}

export class Provisioner {
    constructor(private cfg: Config) {}

    provision(folder: string) {
        core.addPath(folder)
    }
}

export default {
    Provisioner,
}
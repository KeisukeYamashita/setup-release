import * as core from '@actions/core'
import {Agent, Inputs} from './agent'
import {Downloader, Config as DownloaderConfig, archiveType} from './downloader'
import {Provisioner, Config as ProvisionerConfig} from './provisioner'

async function run(): Promise<void> {
  try {
    const [owner, repo] = core.getInput('repository').split('/')
    const inputs: Inputs = {
      arch: core.getInput('arch'),
      archive: core.getInput('archive') as archiveType,
      name: core.getInput('name'),
      owner,
      platform: core.getInput('platform'),
      repo,
      tag: core.getInput('tag'),
      token: core.getInput('token')
    }

    const downloader = new Downloader(inputs as DownloaderConfig)
    const provisioner = new Provisioner(inputs as ProvisionerConfig)
    const agent = new Agent(downloader, provisioner)
    await agent.run()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

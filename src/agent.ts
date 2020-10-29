import {Downloader, Config as DownloaderConfig} from './downloader'
import {Provisioner, Config as ProvisionerConfig} from './provisioner'

export type Inputs = DownloaderConfig | ProvisionerConfig

export class Agent {
  constructor(
    private downloader: Downloader,
    private provisioner: Provisioner
  ) {}

  async run(): Promise<void> {
    const folder = await this.downloader.download()
    this.provisioner.provision(folder)
  }
}

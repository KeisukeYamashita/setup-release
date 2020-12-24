import * as github from '@actions/github'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {
  ReposGetLatestReleaseResponseData,
  ReposGetReleaseAssetResponseData
} from '@octokit/types'
import {inspect} from 'util'

export type archiveType = 'tar.gz' | 'zip' | 'darwin'

export interface Config {
  installPath: string
  owner: string
  repo: string
  token: string
  tag: string
  platform: string
  arch: string
  archive: archiveType
}

export class Downloader {
  private latest: boolean
  constructor(private cfg: Config) {
    this.latest = cfg.tag === 'latest'
  }

  isTargetAsset(asset: ReposGetReleaseAssetResponseData): boolean {
    const {name} = asset
    return (
      name.includes(this.cfg.platform) &&
      name.includes(this.cfg.arch) &&
      name.includes(this.cfg.archive)
    )
  }

  async download(): Promise<string> {
    const client = github.getOctokit(this.cfg.token)

    let release: ReposGetLatestReleaseResponseData
    if (this.latest) {
      const resp = await client.repos.getLatestRelease({
        owner: this.cfg.owner,
        repo: this.cfg.repo
      })
      release = resp.data
    } else {
      const resp = await client.repos.getReleaseByTag({
        owner: this.cfg.owner,
        repo: this.cfg.repo,
        tag: this.cfg.tag
      })
      release = resp.data
    }

    const asset = release.assets.find(a => this.isTargetAsset(a))
    if (!asset) {
      core.debug(`Cound not find asset ${inspect(this.cfg)}`)
      core.debug(`Asset count:${release.assets}, release:${inspect(release)}`)
      core.setOutput('matched', false)
      throw new Error('Cound not find asset')
    }

    core.setOutput('asset-id', asset.id)
    core.setOutput('asset-name', asset.name)

    const assetPath = await tc.downloadTool(
      asset.browser_download_url,
      `/tmp/${this.cfg.installPath}`,
      `Bearer ${this.cfg.token}`
    )

    core.debug(`Download asset: ${asset.name}`)

    let assetExtractedFolder: string
    switch (this.cfg.archive) {
      case 'tar.gz':
        assetExtractedFolder = await tc.extractTar(assetPath)
        break
      case 'darwin':
        assetExtractedFolder = await tc.extractXar(assetPath)
        break
      case 'zip':
        assetExtractedFolder = await tc.extractZip(assetPath)
        break
    }

    return assetExtractedFolder
  }
}

export default {
  Downloader
}

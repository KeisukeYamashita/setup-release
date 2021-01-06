import * as github from '@actions/github'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {
  ReposGetLatestReleaseResponseData,
  ReposGetReleaseAssetResponseData
} from '@octokit/types'
import {inspect, promisify} from 'util'
import * as stream from 'stream'
import got from 'got'
import * as fs from 'fs'
const pipeline = promisify(stream.pipeline)

const cacheKey = 'release'
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

  private isTargetAsset(asset: ReposGetReleaseAssetResponseData): boolean {
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
      this.cfg.tag = release.tag_name
    } else {
      const resp = await client.repos.getReleaseByTag({
        owner: this.cfg.owner,
        repo: this.cfg.repo,
        tag: this.cfg.tag
      })
      release = resp.data
    }

    // check cache
    const toolPath = tc.find(cacheKey, this.cfg.tag)
    if (toolPath) {
      core.info(`Found in cache @ ${toolPath} for tag ${this.cfg.tag}`)
      core.setOutput('restore-from-cache', true)
      return toolPath
    }

    core.setOutput('restore-from-cache', false)

    const asset = release.assets.find(a => this.isTargetAsset(a))
    if (!asset) {
      core.debug(`Cound not find asset ${inspect(this.cfg)}`)
      core.debug(`Asset count:${release.assets}, release:${inspect(release)}`)
      core.setOutput('matched', false)
      throw new Error('Cound not find asset')
    }

    core.setOutput('asset-id', asset.id)
    core.setOutput('asset-name', asset.name)

    const dest = `/tmp/${this.cfg.installPath}`

    await pipeline(
      got.stream(asset.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'GitHub Actions',
          Accept: 'application/octet-stream',
          Authorization: `token ${this.cfg.token}`
        }
      }),
      fs.createWriteStream(dest)
    )

    core.debug(`Download asset: ${asset.name}`)

    let assetExtractedFolder: string
    switch (this.cfg.archive) {
      case 'tar.gz':
        assetExtractedFolder = await tc.extractTar(dest)
        break
      case 'darwin':
        assetExtractedFolder = await tc.extractXar(dest)
        break
      case 'zip':
        assetExtractedFolder = await tc.extractZip(dest)
        break
    }

    core.debug(`Cached @ ${assetExtractedFolder} for tag ${this.cfg.tag}`)
    return await tc.cacheDir(assetExtractedFolder, cacheKey, this.cfg.tag)
  }
}

export default {
  Downloader
}

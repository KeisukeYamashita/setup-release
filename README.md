# action-install-release

A GitHub Action that downloads a release and provision for later job usage.
You don't need to download assets and extract, add system pathes, this action will do it for you with very easy configuration.

[![Release](https://img.shields.io/github/v/release/open-turo/action-install-release)](https://github.com/open-turo/action-install-release/releases/)
[![Tests pass/fail](https://img.shields.io/github/workflow/status/open-turo/action-install-release/CI)](https://github.com/open-turo/action-install-release/actions/)
[![License](https://img.shields.io/github/license/open-turo/action-install-release)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/dwyl/esta/issues)
![CI](https://github.com/open-turo/action-install-release/actions/workflows/release.yaml/badge.svg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.2-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Join us!](https://img.shields.io/badge/Turo-Join%20us%21-593CFB.svg)](https://turo.com/jobs)

## Usage

```yml
- name: Get conftest CLI
  uses: KeisukeYamashita/setup-release@v1.0.2
  with:
    repository: open-policy-agent/conftest
```

### Dowload and provision tagged and latest release

This is just an example to show one way in which this action can be used.

```yml
on: pull_request
jobs:
  provision-tagged-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: KeisukeYamashita/setup-release@v1.0.2
        with:
          repository: spinnaker/kleat
          tag: v0.3.0
      # Use the "kleat" command in the later steps
  provision-latest-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: KeisukeYamashita/setup-release@v1.0.2
        with:
          repository: spinnaker/kleat
      # Use the "kleat" command in the later steps
```

### Action inputs

| Name          | Description                                                                                                                           | Default                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `arch`        | The asset arch target.                                                                                                                | `amd64`                     |
| `archive`     | Archive type. Currently, `tar.gz`, `darwin` and `zip` is supported.                                                                   | `tar.gz`                    |
| `installPath` | Path to install the extracted asset                                                                                                   | UUID                        |
| `repository`  | The GitHub repository where it is released                                                                                            | `true`                      |
| `number`      | The number of the issue to post.                                                                                                      | `github.event.issue.number` |
| `platform`    | Assets target platform. `linux`, `darwin` is supported.                                                                               | `linux`                     |
| `tag`         | GitHub tag of the release                                                                                                             | `latest`                    |
| `token`       | `GITHUB_TOKEN` or a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN`              |

_Note: You cannot use this action if the asset name is not included in the asset name because the search is based on the three inputs(`arch`, `archive` and `platform`) in the asset.name field._

#### Install Path

The extracted assets will be stores in `/tmp/${UUID}` by default. It is recommented to use this if you have multiple stages that uses this action.
But, if you want to configure it, you can use `installPath`.

### Action outputs

| Name                 | Description                               |
| -------------------- | ----------------------------------------- |
| `asset-id`           | ID of the downloaded, provisioned asset   |
| `asset-name`         | Name of the downloaded, provisioned asset |
| `restore-from-cache` | If restored from cache or not             |
| `tag`                | Tag that downloaded                       |

### Accessing issues in other repositories

You can close issues in another repository by using a [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) instead of `GITHUB_TOKEN`.
The user associated with the PAT must have write access to the repository.

## License

[MIT](LICENSE)

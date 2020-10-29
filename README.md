# Download Provision Release
[![CI](https://github.com/KeisukeYamashita/download-provision-release/workflows/build-test/badge.svg)](https://github.com/KeisukeYamashita/download-provision-release/actions?query=workflow%3Abuild-test)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Downoald%20Provision%20Release-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEZPfsVJ61jbxaF0cRQRcRJ9hlYn30IHN/+9iquDCOIsblIrOjqKgy5aKoJQj4O3EEtbPwhJbr6Te28CmdSKeqzeqr0YbfVIrTBKakvtOl5dtTkK+v4HfA9PEyBFCY9AGVgCBLaBp1jPAyfAJ/AAdIEG0dNAiyP7+K1qIfMdonZic6+WJoBJvQlvuwDqcXadUuqPA1NKAlexbRTAIMvMOCjTbMwl1LtI/6KWJ5Q6rT6Ht1MA58AX8Apcqqt5r2qhrgAXQC3CZ6i1+KMd9TRu3MvA3aH/fFPnBodb6oe6HM8+lYHrGdRXW8M9bMZtPXUji69lmf5Cmamq7quNLFZXD9Rq7v0Bpc1o/tp0fisAAAAASUVORK5CYII=)](https://github.com/marketplace/actions/download-provision-release)

A GitHub Action that downloads a release and provision for later job usage.
You don't need to download assets and extract, add system pathes, this action will do it for you with very easy configurations.

## Usage

```yml
      - name: Get conftest CLI
        uses: KeisukeYamashita/download-provision-release@v1
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
      - uses: KeisukeYamashita/download-provision-release@v1
        with:
          repository: spinnaker/kleat
          tag: v0.3.0
      # Use the "kleat" command in the later steps
  provision-latest-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: KeisukeYamashita/download-provision-release@v1
        with:
          repository: spinnaker/kleat
      # Use the "kleat" command in the later steps
```

### Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `arch` | The asset arch target. | `amd64` |  
| `archive` | Archive type. Currently, `tar.gz`, `darwin` and `zip` is supported. | `tar.gz` |
| `repository` | The GitHub repository where it is released | `true` |
| `number` | The number of the issue to post. | `github.event.issue.number` |
| `platform` | Assets target platform. `linux`, `darwin` is supported. | `linux` |
| `tag` | GitHub tag of the release | `latest` |
| `token` | `GITHUB_TOKEN` or a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN` |

*Note: You cannot use this action if the asset name is not included in the asset name because the search is based on the three inputs(`arch`, `archive` and `platform`) in the asset.name field.*

### Action outputs

| Name | Description |
| --- | --- |
| `asset-id` | ID of the downloaded, provisioned asset |
| `asset-name` | Name of the downloaded, provisioned asset | 

### Accessing issues in other repositories

You can close issues in another repository by using a [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) instead of `GITHUB_TOKEN`.
The user associated with the PAT must have write access to the repository.

## License

[MIT](LICENSE)

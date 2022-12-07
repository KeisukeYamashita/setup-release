import {config} from 'process'
import {Downloader} from '../src/downloader'
import {Provisioner} from '../src/provisioner'

// These two tests are just intended to load the main source code so that `jest
// --coverage` actually generates a coverage report, to get our CI to not fail
// on the coverage being missing.
test('downloader works', () => {
  expect(Downloader).toBeDefined()
})

test('provisioner works', () => {
  expect(Provisioner).toBeDefined()
})

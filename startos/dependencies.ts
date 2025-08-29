import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '>=28.1:3-alpha.8',
    healthChecks: ['sync-progress'],
  },
}))

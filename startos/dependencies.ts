import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '^29.1:2-beta.0', // jam currently uses bdb which is incompatible with Core v30
    healthChecks: ['sync-progress'],
  },
}))

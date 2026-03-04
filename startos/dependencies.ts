import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '>=28.3:0-beta.0 <30.0:0-beta.0',
    healthChecks: ['bitcoind', 'sync-progress'],
  },
}))

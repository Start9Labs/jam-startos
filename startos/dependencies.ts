import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '>=28.3:7 <30.0:0',
    healthChecks: ['bitcoind', 'sync-progress'],
  },
}))

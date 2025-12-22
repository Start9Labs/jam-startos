import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { joinmarketCfg } from '../fileModels/joinmarket.cfg'
import { configDefaults } from '../utils'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await joinmarketCfg.write(effects, configDefaults)
  },
})

import { utils, VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { storeJson } from '../fileModels/store.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await storeJson.write(effects, {
      jamInstanceId: `jam_${utils.getDefaultString({ charset: 'a-z,A-Z', len: 9 })}`,
    })
  },
})

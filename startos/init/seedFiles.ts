import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    jamInstanceId: `jam_${utils.getDefaultString({ charset: 'a-z,A-Z', len: 9 })}`,
  })
})

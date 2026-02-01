import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string } = matches

const shape = object({
  APP_PASSWORD: string.optional().onMismatch(undefined),
  JM_RPC_PASSWORD: string.optional().onMismatch(undefined),
  jamInstanceId: string,
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)

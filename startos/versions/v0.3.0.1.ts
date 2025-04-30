import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rmdir } from 'fs/promises'
import { load } from 'js-yaml'
import { sdk } from '../sdk'

export const v_0_3_0_1 = VersionInfo.of({
  version: '0.3.0:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const { password } = load(
        await readFile('/root/start9/config.yaml', 'utf-8'),
      ) as {
        password: string
      }

      await sdk.store.setOwn(effects, sdk.StorePath.password, password)

      await rmdir('/root/start9')
    },
    down: IMPOSSIBLE,
  },
})

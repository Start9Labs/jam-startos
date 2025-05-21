import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { store } from '../../fileModels/store.json'
import { sdk } from '../../sdk'
import { resetPassword } from '../../actions/resetPassword'

export const v_0_3_0_1 = VersionInfo.of({
  version: '0.3.0:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const yaml = load(await readFile('/root/start9/config.yaml', 'utf-8')) as
        | {
            password?: string
          }
        | undefined

      if (yaml?.password) {
        await store.write(effects, { password: yaml.password })
      }

      await rm('/root/start9', { recursive: true })
    },
    down: IMPOSSIBLE,
  },
})

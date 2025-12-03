import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { store } from '../../fileModels/store.json'

export const v_0_4_1_2_beta0 = VersionInfo.of({
  version: '0.4.1:2-beta.0',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const yaml = load(
        await readFile(
          '/media/startos/volumes/main/start9/config.yaml',
          'utf-8',
        ),
      ) as
        | {
            password?: string
          }
        | undefined

      if (yaml?.password) {
        await store.write(effects, { password: yaml.password })
      }

      await rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})

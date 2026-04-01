import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { storeJson } from '../fileModels/store.json'

export const v_0_4_1_7 = VersionInfo.of({
  version: '0.4.1:7',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.65',
    es_ES: 'Actualización a StartOS SDK beta.65',
    de_DE: 'Update auf StartOS SDK beta.65',
    pl_PL: 'Aktualizacja do StartOS SDK beta.65',
    fr_FR: 'Mise à jour vers StartOS SDK beta.65',
  },
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml:
        | {
            password: string
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        await storeJson.write(effects, {
          APP_PASSWORD: configYaml.password,
          jamInstanceId: 'embassy_jam_wallet',
        })
        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})

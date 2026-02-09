import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { storeJson } from '../../fileModels/store.json'

export const v_0_4_1_5_b0 = VersionInfo.of({
  version: '0.4.1:5-beta.0',
  releaseNotes: {
    en_US: 'Updated StartOS packaging',
    es_ES: 'Actualizado el empaquetado de StartOS',
    de_DE: 'StartOS-Paketierung aktualisiert',
    pl_PL: 'Zaktualizowano pakietowanie StartOS',
    fr_FR: 'Mise à jour du packaging StartOS',
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

import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { storeJson } from '../../fileModels/store.json'
import { joinmarketCfg } from '../../fileModels/joinmarket.cfg'

export const v_0_4_1_3_b1 = VersionInfo.of({
  version: '0.4.1:3-beta.1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml:
        | {
            password: string
            'bitcoind-user': string
            'bitcoind-password': string
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        await storeJson.write(effects, { password: configYaml.password })
        await joinmarketCfg.merge(effects, {
          BLOCKCHAIN: {
            rpc_user: configYaml['bitcoind-user'],
            rpc_password: configYaml.password,
          },
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

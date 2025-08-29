import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { joinmarketCfg } from '../fileModels/joinmarket.cfg'
import { sdk } from '../sdk'
import { configDefaults, randomPassword } from '../utils'
import { utils } from '@start9labs/start-sdk'

export const setup = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const password = utils.getDefaultString(randomPassword())

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/root/.joinmarket',
      readonly: false,
    }),
    'jam-init',
    async (sub) => {
      // await sub.execFail(['dinitctl', 'disable', 'tor'])
      await sdk.action.createTask(
        effects,
        'bitcoind',
        generateRpcUserDependent,
        'critical',
        {
          input: {
            kind: 'partial',
            value: {
              username: 'jam',
              password,
            },
          },
          reason: "Jam needs credentials to access Bitcoin's RPC",
        },
      )

      await sub.spawn(['/jam-entrypoint.sh'])

      let cfgExists = false
      for (let i = 0; i < 10 && !cfgExists; i++) {
        cfgExists = !!(await joinmarketCfg.read().once())
        await new Promise((resolve) => setTimeout(resolve, 4_000))
      }
      if (!cfgExists) throw new Error('Failed to initialize Jam')
      await joinmarketCfg.merge(effects, {
        BLOCKCHAIN: {
          ...configDefaults,
          rpc_user: 'jam',
          rpc_password: password,
        },
      })
    },
  )
})

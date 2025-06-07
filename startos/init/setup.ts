import { joinmarketCfg } from '../fileModels/joinmarket.cfg'
import { sdk } from '../sdk'
import { configDefaults } from '../utils'

export const setup = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/root',
      readonly: false,
    }),
    'jam-init',
    async (sub) => {
      await sub.execFail(['dinitctl', 'disable', 'tor'])

      await sub.spawn(['/jam-entrypoint.sh'])

      let cfgExists = false
      for (let i = 0; i < 10 && !cfgExists; i++) {
        cfgExists = !!(await joinmarketCfg.read().once())
        await new Promise((resolve) => setTimeout(resolve, 4000))
      }
      if (!cfgExists) throw new Error('Failed to initialize Jam')
      await joinmarketCfg.merge(effects, configDefaults)
    },
  )
})

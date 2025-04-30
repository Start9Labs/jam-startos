import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { resetPassword } from './actions/resetPassword'
import { joinmarketCfg } from './file-models/joinmarket.cfg'
import { configDefaults } from './utils'

// **** PreInstall ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {})

// **** PostInstall ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  await sdk.SubContainer.withTemp(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of().addVolume('main', null, '/root', false),
    'jam-init',
    async (sub) => {
      await sub.execFail(['dinitctl', 'disable', 'tor'])

      await sub.spawn(['/jam-entrypoint.sh'])

      let cfgExists = false
      for (let i = 0; i < 10 && !cfgExists; i++) {
        cfgExists = !!(await joinmarketCfg.read.once())
        await new Promise((resolve) => setTimeout(resolve, 4000))
      }
      if (!cfgExists) throw new Error('Failed to initialize Jam')
      await joinmarketCfg.merge(effects, configDefaults)
    },
  )

  await sdk.action.requestOwn(effects, resetPassword, 'critical', {
    reason: 'Create you Jam password',
  })
})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  initStore,
  exposedStore,
)

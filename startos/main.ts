import { sdk } from './sdk'
import { APP_USER, uiPort } from './utils'
import { joinmarketCfg } from './fileModels/joinmarket.cfg'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Jam!')

  const osIp = await sdk.getOsIp(effects)

  await joinmarketCfg.merge(effects, {
    'MESSAGING:onion': {
      socks5_host: osIp,
    },
    'MESSAGING:hackint': {
      socks5_host: osIp,
    },
  })

  // read joinmarketCfg to restart service on change
  // const config = await joinmarketCfg.read().const(effects)
  // if (!config) throw new Error('joinmarket config not found!')

  const APP_PASSWORD = await storeJson.read((s) => s.password).const(effects)
  if (!APP_PASSWORD) throw new Error('no password')

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'jam' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'jam',
        subpath: null,
        mountpoint: '/root/.joinmarket',
        readonly: false,
      }),
      'jam-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        APP_USER,
        APP_PASSWORD,
        ENSURE_WALLET: 'true',
        REMOVE_LOCK_FILES: 'true',
      },
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'The web interface is ready',
          errorMessage: 'The web interface is not ready',
        }),
    },
    requires: [],
  })
})

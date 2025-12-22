import { sdk } from './sdk'
import { APP_USER, uiPort } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Jam!')

  const store = await storeJson.read().const(effects)
  if (!store) throw new Error('no store')

  const { APP_PASSWORD, JM_RPC_PASSWORD, jamInstanceId } = store

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
        JM_RPC_USER: jamInstanceId,
        JM_RPC_PASSWORD,
        JM_RPC_HOST: 'bitcoind.startos',
        JM_RPC_PORT: '8332',
        JM_RPC_WALLET_FILE: jamInstanceId,
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

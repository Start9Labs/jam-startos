import { sdk } from './sdk'
import { FileHelper, T } from '@start9labs/start-sdk'
import { APP_USER, uiPort } from './utils'
import { manifest } from 'bitcoind-startos/startos/manifest'
import { joinmarketCfg } from './fileModels/joinmarket.cfg'
import { store } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Jam!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

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
  const config = await joinmarketCfg.read().const(effects)
  if (!config) throw new Error('joinmarket config not found!')

  const APP_PASSWORD = (await store.read((s) => s.password).const(effects))!

  const jamSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root/.joinmarket',
        readonly: false,
      })
      .mountDependency<typeof manifest>({
        dependencyId: 'bitcoind',
        volumeId: 'main',
        subpath: null,
        mountpoint: '/.bitcoin',
        readonly: true,
      }),
    'jam-sub',
  )

  // Restart if cookie changes
  // await FileHelper.string(`${jamSub.rootfs}/.bitcoin/.cookie`)
  //   .read()
  //   .const(effects)

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: jamSub,
    exec: {
      command: ['/jam-entrypoint.sh'],
      env: {
        APP_USER,
        APP_PASSWORD,
        JM_RPC_HOST: config.BLOCKCHAIN.rpc_host,
        JM_RPC_PORT: config.BLOCKCHAIN.rpc_port,
        JM_RPC_WALLET_FILE: config.BLOCKCHAIN.rpc_wallet_file,
        ENSURE_WALLET: 'true',
        REMOVE_LOCK_FILES: 'true',
        RESTORE_DEFAULT_CONFIG: 'false',
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

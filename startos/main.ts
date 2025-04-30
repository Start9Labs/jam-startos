import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { APP_USER, uiPort } from './utils'
import { manifest } from 'bitcoind-startos/startos/manifest'
import { joinmarketCfg } from './file-models/joinmarket.cfg'

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
    'messaging:onion': {
      socks5_host: osIp,
    },
    'messaging:hackint': {
      socks5_host: osIp,
    },
  })

  // read joinmarketCfg to restart service on change
  await joinmarketCfg.read.const(effects)

  const jamSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'jam' },
    sdk.Mounts.of()
      .addVolume('main', null, '/root', false)
      .addDependency<
        typeof manifest
      >('bitcoind', 'main', '/.bitcoin', '/.bitcoin', true),
    'jam-sub',
  )

  await jamSub.execFail(['dinitctl', 'disable', 'tor'])

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const additionalChecks: T.HealthCheck[] = []

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, additionalChecks).addDaemon(
    'primary',
    {
      subcontainer: jamSub,
      command: ['/jam-entrypoint.sh'],
      env: {
        APP_USER,
        APP_PASSWORD: await sdk.store
          .getOwn(effects, sdk.StorePath.password)
          .const(),
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
    },
  )
})

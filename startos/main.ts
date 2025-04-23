import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'
import { manifest } from 'bitcoind-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Jam!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  const { username, password } = await sdk.store
    .getOwn(effects, sdk.StorePath)
    .const()

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
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'jam' },
        sdk.Mounts.of()
          .addVolume('main', null, '/data', false)
          .addDependency<
            typeof manifest
          >('bitcoind', 'main', '/.bitcoin', '/.bitcoin', true),
        'jam-sub',
      ),
      command: ['/jam-entrypoint.sh'],
      env: {
        APP_USER: username,
        APP_PASSWORD: password,
        JM_RPC_COOKIE_FILE: '.bitcoin/.cookie',
        JM_RPC_PORT: '8332',
        // @TODO can we change this?
        JM_RPC_WALLET_FILE: 'embassy_jam_wallet',
        JM_RPC_HOST: 'bitcoind.startos',
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

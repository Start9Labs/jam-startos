import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'jam',
  title: 'Jam',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/jam-startos',
  upstreamRepo: 'https://github.com/joinmarket-webui/jam-docker',
  supportSite: 'https://github.com/joinmarket-webui/jam/issues',
  marketingSite: 'https://jamapp.org',
  donationUrl: null,
  description: {
    short: 'A web user interface for JoinMarket.',
    long: 'Jam is a web interface for JoinMarket focusing on user-friendliness and ease-of-use. It aims to provide sensible defaults and be easy to use for beginners while still having the features advanced users expect.',
  },
  volumes: ['main'],
  images: {
    jam: {
      source: {
        dockerTag:
          'ghcr.io/joinmarket-webui/jam-standalone:v0.3.0-clientserver-v0.9.11',
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description:
        'Used to subscribe to new block events from a full archival node',
      optional: false,
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.0-alpha.2/bitcoind.s9pk',
    },
  },
})

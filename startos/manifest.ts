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
  docsUrl: 'https://github.com/Start9Labs/jam-startos/docs/instructions.md',
  description: {
    short: 'JoinMarket server with web UI',
    long: 'Jam is Joinmarket plus a web user interface for JoinMarket focusing on user-friendliness and ease-of-use. It aims to provide sensible defaults and be easy to use for beginners while still having the features advanced users expect.',
  },
  volumes: ['main', 'jam'],
  images: {
    jam: {
      source: {
        dockerTag:
          'ghcr.io/joinmarket-webui/jam-standalone:v0.4.1-clientserver-v0.9.11',
      },
    },
  },
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
      description: 'Used to subscribe to new block events.',
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})

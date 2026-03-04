import { setupManifest } from '@start9labs/start-sdk'
import i18n, { depBitcoindDescription } from './i18n'

export const manifest = setupManifest({
  id: 'jam',
  title: 'Jam',
  license: 'mit',
  packageRepo: 'https://github.com/Start9Labs/jam-startos/tree/update/040',
  upstreamRepo: 'https://github.com/joinmarket-webui/jam-docker',
  marketingUrl: 'https://jamapp.org',
  donationUrl: null,
  docsUrls: ['https://jamdocs.org/'],
  description: i18n.description,
  volumes: ['main', 'jam'],
  images: {
    jam: {
      source: {
        dockerTag:
          'ghcr.io/joinmarket-webui/jam-standalone:v0.4.1-clientserver-v0.9.11',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: depBitcoindDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
      },
    },
  },
})

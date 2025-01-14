import { CheckpointConfig } from '@snapshot-labs/checkpoint';
import Poster from './abis/Poster.json';

const CONFIG = {
  mainnet: {
    networkNodeUrl: 'https://starknet-mainnet.infura.io/v3/c82b1cf516984b599108487a1b6481c4',
    contract: '0x0654e9232d5f402829755029901f69c32b423ded0f8c081e416e3b24f5a7a46e',
    start: 639485
  },
  sepolia: {
    networkNodeUrl: 'https://starknet-sepolia.infura.io/v3/c82b1cf516984b599108487a1b6481c4',
    contract: '0x03aa7630a4f9c5108bf3cd1910c7d45404cba865fc0fc0756bf9eedc073a98a9',
    start: 65137
  }
};

export function createConfig(indexerName: keyof typeof CONFIG): CheckpointConfig {
  const { networkNodeUrl, contract, start } = CONFIG[indexerName];

  return {
    network_node_url: networkNodeUrl,
    optimistic_indexing: false,
    fetch_interval: 15000,
    sources: [
      {
        contract,
        start,
        abi: 'Poster',
        events: [
          {
            name: 'NewPost',
            fn: 'handleNewPost'
          }
        ]
      }
    ],
    abis: {
      Poster
    }
  };
}

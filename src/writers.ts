import { evm } from '@snapshot-labs/checkpoint';

export const handleProxyDeployed: evm.Writer = async ({ block, event }) => {
  if (!block || !event) return;

  console.log('deployed', event.args.implementation, event.args.proxy);
};

export const handleNewPost: evm.Writer = async ({ block, event }) => {
  if (!block || !event) return;

  console.log('new post', event.args);
};

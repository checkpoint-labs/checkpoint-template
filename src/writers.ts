import { evm } from '@snapshot-labs/checkpoint';
import { Proxy } from '../.checkpoint/models';

export const handleProxyDeployed: evm.Writer = async ({ block, tx, event }) => {
  if (!block || !event) return;

  const proxy = new Proxy(event.args.proxy);
  proxy.implementation = event.args.implementation;
  proxy.deployer = tx.from;
  proxy.created_at = block.timestamp;
  proxy.created_at_block = block.number;
  await proxy.save();
};

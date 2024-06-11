import { evm } from '@snapshot-labs/checkpoint';
import { Proxy, ProxyTwo, DeployerStat } from '../.checkpoint/models';

export const handleProxyDeployed: evm.Writer = async ({ block, tx, event }) => {
  if (!block || !event) return;

  const proxyTwo = new ProxyTwo(event.args.proxy);
  proxyTwo.f = event.args.implementation;
  await proxyTwo.save();

  const proxy = new Proxy(event.args.proxy);
  proxy.implementation = event.args.implementation;
  proxy.deployer = tx.from;
  proxy.created_at = block.timestamp;
  proxy.created_at_block = block.number;
  proxy.proxyTwo = proxyTwo.id;
  await proxy.save();

  let deployerStats = await DeployerStat.loadEntity(tx.from);
  if (!deployerStats) deployerStats = new DeployerStat(tx.from);
  deployerStats.deploy_count += 1;
  await deployerStats.save();
};

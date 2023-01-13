import { getEvent, toAddress } from './utils';
import type { CheckpointWriter } from '@snapshot-labs/checkpoint';

export async function handleTransfer({
  block,
  tx,
  event,
  eventIndex,
  mysql
}: Parameters<CheckpointWriter>[0]) {
  if (!event || !eventIndex) return;

  const format = 'from, to, value(uint256)';
  const data: any = getEvent(event.data, format);

  const transfer = {
    id: `${tx.transaction_hash}/${eventIndex}`,
    token: toAddress(event.from_address),
    from: data.from,
    to: data.to,
    value: data.value,
    created_at: block.timestamp,
    created_at_block: block.block_number
  };

  await mysql.queryAsync('INSERT IGNORE INTO transfers SET ?', [transfer]);
}

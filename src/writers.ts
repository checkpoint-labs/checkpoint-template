import { validateAndParseAddress } from 'starknet';
import { CheckpointWriter } from '@snapshot-labs/checkpoint';
import { Post } from '../.checkpoint/models';
import { longStringToText } from './utils';

export const handleNewPost: CheckpointWriter = async ({ block, tx, rawEvent, event }) => {
  if (!block || !event || !rawEvent) return;

  const author = validateAndParseAddress(rawEvent.from_address);
  const content = longStringToText(event.content);
  const tag = longStringToText(event.tag);

  const post = new Post(`${author}/${tx.transaction_hash}`);
  post.author = author;
  post.content = content;
  post.tag = tag;
  post.tx_hash = tx.transaction_hash;
  post.created_at = block.timestamp;
  post.created_at_block = block.block_number;

  await post.save();
};

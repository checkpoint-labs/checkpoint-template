import { validateAndParseAddress } from 'starknet';
import { starknet } from '@snapshot-labs/checkpoint';
import { Post } from '../.checkpoint/models';
import { longStringToText } from './utils';

export function createStarknetWriters(indexerName: string) {
  const handleNewPost: starknet.Writer = async ({ block, tx, rawEvent, event }) => {
    if (!block || !event || !rawEvent) return;

    const author = validateAndParseAddress(rawEvent.from_address);
    const content = longStringToText(event.content);
    const tag = longStringToText(event.tag);

    const post = new Post(`${author}/${tx.transaction_hash}`, indexerName);
    post.author = author;
    post.content = content;
    post.tag = tag;
    post.tx_hash = tx.transaction_hash;
    post.created_at = block.timestamp;
    post.created_at_block = block.block_number;

    await post.save();
  };

  return {
    handleNewPost
  };
}

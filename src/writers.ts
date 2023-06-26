import { hexStrArrToStr, toAddress } from './utils';
import type { CheckpointWriter } from '@snapshot-labs/checkpoint';
import { Post } from '../.checkpoint/models';

export async function handleDeploy() {
  // Run logic as at the time Contract was deployed.
}

// This decodes the new_post rawEvents data and stores successfully
// decoded information in the `posts` table.
export async function handleNewPost({ block, tx, rawEvent, mysql }: Parameters<CheckpointWriter>[0]) {
  try {  
    if (!rawEvent) return;
    const author = toAddress(rawEvent.data[0]);
    let content = '';
    let tag = '';
    const contentLength = BigInt(rawEvent.data[1]);
    const tagLength = BigInt(rawEvent.data[2 + Number(contentLength)]);
    const timestamp = block!.timestamp;
    const blockNumber = block!.block_number;

    // parse content bytes
    try {
      content = hexStrArrToStr(rawEvent.data, 2, contentLength);
    } catch (e) {
      console.error(`failed to decode content on block [${blockNumber}]: ${e}`);
      return;
    }

    // parse tag bytes
    try {
      tag = hexStrArrToStr(rawEvent.data, 3 + Number(contentLength), tagLength);
    } catch (e) {
      console.error(`failed to decode tag on block [${blockNumber}]: ${e}`);
      return;
    }

    // Create new Post from generated models
    const post = new Post(`${author}/${tx.transaction_hash}`);
    post.author = author;
    post.content = content;
    post.tag = tag;
    post.tx_hash = tx.transaction_hash!,
    post.created_at = timestamp;
    post.created_at_block = blockNumber;

    // Save Posts into your db
    await post.save();
  } catch (err) {
    console.log(err)
  }
}

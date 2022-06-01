import { CheckpointWriters } from '@snapshot-labs/checkpoint';
import { hexStrArrToStr, toAddress } from './utils';

export const writers: CheckpointWriters = {
  handleDeploy: async () => {
    // Run logic as at the time Contract was deployed.
  },

  handleNewPost: async ({ receipt, block, mysql }) => {
    const event = receipt.events[0] as any;
    const author = toAddress(event.data[0]);
    let content = '';
    let tag = '';
    const contentLength = BigInt(event.data[1]);
    const tagLength = BigInt(event.data[2 + Number(contentLength)]);

    // parse content bytes
    try {
      content = hexStrArrToStr(event.data, 2, contentLength);
    } catch (e) {
      console.error(`failed to decode content on block [${(block as any).block_number}]: ${e}`);
      return;
    }

    // parse tag bytes
    try {
      tag = hexStrArrToStr(event.data, 3 + Number(contentLength), tagLength);
    } catch (e) {
      console.error(`failed to decode tag on block [${(block as any).block_number}]: ${e}`);
      return;
    }

    const timestamp = (block as any).timestamp;

    // post object matches fields of Post type in schema.gql
    const post = {
      id: `${author}/${event.keys[0]}/${timestamp}`,
      author,
      content,
      tag,
      tx_hash: receipt.transaction_hash,
      created_at: timestamp,
      created_at_block: receipt.block_number
    };

    // table names are `lowercase(TypeName)s` and can be interacted with sql
    await mysql.queryAsync('INSERT IGNORE INTO posts SET ?', [post]);
  }
};

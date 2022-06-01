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
    const timestamp = (block as any).timestamp;
    const blockNumber = (block as any).block_number;

    // parse content bytes
    try {
      content = hexStrArrToStr(event.data, 2, contentLength);
    } catch (e) {
      console.error(`failed to decode content on block [${blockNumber}]: ${e}`);
      return;
    }

    // parse tag bytes
    try {
      tag = hexStrArrToStr(event.data, 3 + Number(contentLength), tagLength);
    } catch (e) {
      console.error(`failed to decode tag on block [${blockNumber}]: ${e}`);
      return;
    }

    // post object matches fields of Post type in schema.gql
    const post = {
      id: `${author}/${receipt.transaction_hash}`,
      author,
      content,
      tag,
      tx_hash: receipt.transaction_hash,
      created_at: timestamp,
      created_at_block: blockNumber
    };

    // table names are `lowercase(TypeName)s` and can be interacted with sql
    await mysql.queryAsync('INSERT IGNORE INTO posts SET ?', [post]);
  }
};

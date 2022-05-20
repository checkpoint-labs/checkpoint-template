import { shortStringArrToStr } from '@snapshot-labs/sx';
import { CheckpointWriters } from '@snapshot-labs/checkpoint';
import { toAddress } from './utils';

export const writers: CheckpointWriters = {
  handleDeploy: async () => {
    // Run logic as at the time Contract was deployed.
  },

  handleNewPost: async ({ receipt, block, mysql }) => {
    const event = receipt.events[0] as any;
    const author = toAddress(event.data[0]);
    console.log(receipt);
    let content = '';
    try {
      const contentLength = BigInt(event.data[1]);
      const contentArr = event.data.slice(2, 2 + Number(contentLength));
      console.log(contentArr);
      content = shortStringArrToStr(contentArr.map(m => BigInt(m)));
    } catch (e) {
      console.error(e);
    }

    // post object matches fields of Post type in schema.gql
    const post = {
      id: `${author}/${event.keys[0]}`,
      author,
      content,
      tag: null,
      tx_hash: receipt.transaction_hash,
      created_at: (block as any).timestamp,
      created_at_block: receipt.block_number
    };

    console.log('Found post', receipt.events, content);

    // table names are `lowercase(TypeName)s` and can be interacted with sql
    await mysql.queryAsync('INSERT IGNORE INTO posts SET ?', [post]);
  }
};

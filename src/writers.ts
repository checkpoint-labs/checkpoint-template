import { CheckpointWriter } from '@snapshot-labs/checkpoint';
import { hexStrArrToStr, toAddress } from './utils';

export const handleDeploy: CheckpointWriter = async () => {
  // Run logic as at the time Contract was deployed.
};

// This decodes the new_post events data and stores successfully
// decoded information in the `posts` table.
//
// See here for the original logic used to create post transactions:
// https://gist.github.com/perfectmak/417a4dab69243c517654195edf100ef9#file-index-ts
export const handleNewPost: CheckpointWriter = async ({ receipt, block, mysql }) => {
  const event = receipt.events[0] as any;
  const author = toAddress(event.data[0]);
  let content = '';
  let tag = '';
  const contentLength = BigInt(event.data[1]);
  const tagLength = BigInt(event.data[2 + Number(contentLength)]);
  const timestamp = block.timestamp;
  const blockNumber = block.block_number;

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
};

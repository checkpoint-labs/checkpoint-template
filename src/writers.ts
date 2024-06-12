import { validateAndParseAddress } from 'starknet';
import { starknet } from '@snapshot-labs/checkpoint';
import { Post, User, UserInfo, Tag } from '../.checkpoint/models';
import { longStringToText } from './utils';

export const handleNewPost: starknet.Writer = async ({ block, tx, rawEvent, event }) => {
  if (!block || !event || !rawEvent) return;

  const author = validateAndParseAddress(rawEvent.from_address);
  const content = longStringToText(event.content);
  const tagValue = longStringToText(event.tag);

  let user = await User.loadEntity(author);
  if (!user) {
    user = new User(author);
    user.info = author;
    user.created_at = block.timestamp;
    user.created_at_block = block.block_number;
    await user.save();
  }

  let userInfo = await UserInfo.loadEntity(author);
  if (!userInfo) userInfo = new UserInfo(author);
  userInfo.post_count += 1;
  await userInfo.save();

  let tag = await Tag.loadEntity(tagValue);
  if (!tag) {
    tag = new Tag(tagValue);
    tag.created_at = block.timestamp;
    tag.created_at_block = block.block_number;
    await tag.save();
  }

  const post = new Post(`${author}/${tx.transaction_hash}`);
  post.author = author;
  post.content = content;
  post.tags = [tagValue];
  post.tx_hash = tx.transaction_hash;
  post.created_at = block.timestamp;
  post.created_at_block = block.block_number;

  await post.save();
};

import { mockDeep } from 'jest-mock-extended';
import { AsyncMySqlPool, ContractSourceConfig } from '@snapshot-labs/checkpoint';
import { Transaction, TransactionReceipt } from 'starknet';
import { writers } from '../src/writers';

describe('Writers', () => {
  describe('handleNewPost', () => {
    it('should create posts correctly', async () => {
      const block = {
        timestamp: 1652650963200
      };
      const tx = mockDeep<Transaction>();
      const source = mockDeep<ContractSourceConfig>();
      const receipt = mockDeep<TransactionReceipt>();
      const mockMysql = mockDeep<AsyncMySqlPool>();

      await writers.handleNewPost({
        tx,
        source,
        block: block as unknown as number,
        receipt,
        mysql: mockMysql
      });

      expect(mockMysql.queryAsync.mock.calls).toMatchSnapshot();
    });
  });
});

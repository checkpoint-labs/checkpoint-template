import { mockDeep } from 'jest-mock-extended';
import { AsyncMySqlPool, ContractSourceConfig } from '@snapshot-labs/checkpoint';
import { Transaction, TransactionReceipt } from 'starknet';
import { writers } from '../src/writers';

describe('Writers', () => {
  describe('handleNewPost', () => {
    it('should create posts correctly', async () => {
      const block = {
        timestamp: 1652650963200,
        block_number: 500
      };
      const tx = mockDeep<Transaction>();
      const source = mockDeep<ContractSourceConfig>();
      const receipt = {
        events: [
          {
            from_address: '0x521f830ce263a6f0969f914d34e7001bc953c65ff04f316a9d2923eae145967',
            keys: ['0x8fee3afaa1e95194c589c2c7ff049f7667a0ddad86dd1e5172aa5d2053ca88'],
            data: [
              '0x0',
              '0x2',
              '0x5468697320697320612072616e646f6d20706f737420776974682061207261',
              '0x6e646f6d206e756d6265723a20393531',
              '0x1',
              '0x70726976617465'
            ]
          }
        ],
        transaction_hash: '0x5fa53789e3fc35c9dd40914e664d8508023289bdf986ebe30a540698fbeb026'
      };
      const mockMysql = mockDeep<AsyncMySqlPool>();

      await writers.handleNewPost({
        tx,
        source,
        block: block as unknown as number,
        receipt: receipt as unknown as TransactionReceipt,
        mysql: mockMysql
      });

      expect(mockMysql.queryAsync.mock.calls).toMatchSnapshot();
    });
  });
});

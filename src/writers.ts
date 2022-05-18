import { CheckpointWriters } from '@snapshot-labs/checkpoint';

export const writers: CheckpointWriters = {
  handleDeploy: async () => {
    // Run logic as at the time Contract was deployed.
  },
  handleNewPost: async () => {
    // Run logic as at the time Contract was deployed.
  }
};

import useSnapshotId from './useSnapshotId';
import {
  MOCK_CONTRACT_ADDRESS,
  MOCK_PROPOSAL_ID,
  MOCK_SNAPSHOT_ID,
} from 'Modules/Guilds/Hooks/fixtures';
jest.mock('stores/modules/common/fetchers/useSnapshotId', () => ({
  __esModule: true,
  default: () => ({
    data: MOCK_SNAPSHOT_ID,
  }),
}));

describe('useSnapshotId', () => {
  it('should return proposal snapshot ID', () => {
    const { data } = useSnapshotId({
      contractAddress: MOCK_CONTRACT_ADDRESS,
      proposalId: MOCK_PROPOSAL_ID,
    });
    expect(data).toMatchInlineSnapshot(`1`);
  });
});

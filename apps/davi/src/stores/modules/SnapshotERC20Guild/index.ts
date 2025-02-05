import { FullGovernanceImplementation } from 'stores/types';
import {
  useApproveTokens,
  useCreateProposal,
  useExecuteProposal,
  useLockTokens,
  useVoteOnProposal,
  useWithdrawTokens,
} from './writers';
import { useGuildConfig as useGuildConfigFromSubgraph } from '../subgraph/common/useGuildConfig';

import {
  useProposal,
  useSnapshotId,
  useDAOToken,
  useIsProposalCreationAllowed,
  useProposalVotesOfVoter,
  useProposalCalls,
  useVotingResults,
  useGetPermissions,
  useGuildConfig,
  useGetActiveProposals,
} from '../common/fetchers';
import {
  useTotalLocked,
  useVoterLockTimestamp,
  useVotingPowerOf,
  useMemberCount,
} from './fetchers/rpc';
import { checkDataSourceAvailability } from './checkDataSourceAvailability';
import localBytecodes from 'bytecodes/local.json';
import prodBytecodes from 'bytecodes/prod.json';

const GUILD_TYPE = 'SnapshotERC20Guild';
const localConfig = localBytecodes.find(({ type }) => type === GUILD_TYPE);
const prodConfig = prodBytecodes.find(({ type }) => type === GUILD_TYPE);
/*
  I left this case purposefully with just one data source (default),
  to show that a governance implementation doesn't need two sources.
*/

export const snapshotERC20GuildImplementation: Readonly<FullGovernanceImplementation> =
  {
    name: 'SnapshotERC20Guild',
    bytecodes: [
      '0xfc721cf4ee3e10d6df0dc8659bc71c86ec7b2116001838e1d9bc30ccfbe8cfac',
      '0xcfe42d56f58ab49603c49e6c7ca4bd3d2260cec51d296e4a5cfa2a407e299b6c',
      localConfig.bytecodeHash as `0x${string}`,
      localConfig.deployedBytecodeHash as `0x${string}`,
      prodConfig.deployedBytecodeHash as `0x${string}`,
    ],
    hooks: {
      fetchers: {
        default: {
          useProposal,
          useSnapshotId,
          useTotalLocked,
          useDAOToken,
          useIsProposalCreationAllowed,
          useProposalVotesOfVoter,
          useVoterLockTimestamp,
          useProposalCalls,
          useVotingResults,
          useVotingPowerOf,
          useMemberCount,
          useGetPermissions,
          useGuildConfig: useGuildConfigFromSubgraph,
          useGetActiveProposals,
        },
        fallback: {
          useProposal,
          useSnapshotId,
          useTotalLocked,
          useDAOToken,
          useIsProposalCreationAllowed,
          useProposalVotesOfVoter,
          useVoterLockTimestamp,
          useProposalCalls,
          useVotingResults,
          useVotingPowerOf,
          useMemberCount,
          useGetPermissions,
          useGuildConfig,
          useGetActiveProposals,
        },
      },
      writers: {
        useApproveTokens,
        useCreateProposal,
        useExecuteProposal,
        useLockTokens,
        useVoteOnProposal,
        useWithdrawTokens,
      },
    },
    capabilities: {
      votingPower: 'liquid',
      tokenType: 'ERC20',
      consensus: 'quorum',
      votingStyle: 'competition',
      votingPowerTally: 'snapshot',
    },
    checkDataSourceAvailability,
  };

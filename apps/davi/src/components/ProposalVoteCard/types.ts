import { BigNumber } from 'ethers';
import { ERC20Guild } from 'dxdao-contracts/types';
import { ProposalMetadata } from 'types/types.guilds';
import { Moment } from 'moment';
import { providers } from 'ethers';
import { FetcherHooksInterface } from 'stores/types';

export interface VoteConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedOption?: string;
  onConfirm: () => void;
  votingPower?: number;
  currentVoteAmount?: number;
}

export interface Voter {
  avatar: string;
}

export interface hasVotingPowerProps {
  hasNoVotingPower: boolean;
  hasVotingPowerAtCurrentSnapshot: boolean;
}

interface VotingPower {
  percent: number;
  userVotingPower: BigNumber;
  atSnapshot?: BigNumber;
  atCurrentSnapshot: BigNumber;
}

interface Proposal {
  id: string;
  metadata: ProposalMetadata;
  endTime: Moment;
  title?: string;
}

type UseProposalVotesOfVoterReturn = ReturnType<
  FetcherHooksInterface['useProposalVotesOfVoter']
>['data'];

export interface ProposalVoteCardProps {
  voteData: VoteData;
  proposal: Proposal;
  votingPower: VotingPower;
  timestamp: number;
  votingMachineAddress: string;
  userVote?: UseProposalVotesOfVoterReturn;
}

export interface ResultRowProps {
  isPercent: boolean;
  optionKey?: number;
  voteData: VoteData;
  proposalMetadata: ProposalMetadata;
}

export interface VoteChartProps {
  isPercent: boolean;
  voteData: VoteData;
}

export interface Voter {
  avatar: string;
}

export interface ConfirmVoteProposalProps {
  proposal: Proposal;
  contract: ERC20Guild;
  selectedOption: BigNumber;
  userVotingPower: BigNumber;
  createTransaction: (
    summary: string,
    txFunction: () => Promise<providers.TransactionResponse>,
    showModal?: boolean,
    cb?: () => void
  ) => void;
  cb?: () => void;
}

export interface VoteOnProposalProps {
  votingPowerAtProposalSnapshot: BigNumber;
  votingPowerAtProposalCurrentSnapshot: BigNumber;
}

export type VoteResultsProps = Omit<ResultRowProps, 'optionKey'>;

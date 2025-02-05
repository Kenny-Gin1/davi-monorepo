import { render } from 'utils/tests';
import ProposalCardWinningOption from './ProposalCardWinningOption';
import { optionsMock, optionsWithSeveralActionsMock } from 'utils/fixtures';
import { BigNumber } from 'ethers';
import { fireEvent } from '@testing-library/react';
import { mockChain } from 'components/Web3Modals/fixtures';

// More than one option, different vote count
export let variousOptions = [{ ...optionsMock }, { ...optionsMock }];
variousOptions[0].totalVotes = BigNumber.from(10);
variousOptions[1].totalVotes = BigNumber.from(5);

// Option without votes
export let optionWithoutVotes = { ...optionsMock };
optionWithoutVotes.votePercentage = null;

const mockBigNumber = BigNumber.from(100000000);

jest.mock('stores/modules/common/fetchers', () => ({
  useProposalCalls: () => ({ options: [] }),
}));

jest.mock('hooks/Guilds/ens/useENSAvatar', () => ({
  __esModule: true,
  default: () => ({
    avatarUri: 'test',
    imageUrl: 'test',
    ensName: 'test.eth',
  }),
}));

jest.mock('hooks/Guilds/erc20/useERC20Info', () => ({
  useERC20Info: () => ({
    name: 'Test ERC20',
    symbol: 'TEST',
    decimals: 18,
    totalSupply: mockBigNumber,
  }),
}));

jest.mock('wagmi', () => ({
  chain: {},
  useContractRead: () => ({ data: '' }),
  useEnsResolver: () => ({
    data: {
      name: 'name.eth',
      address: '0x0000000000000000000000000000000000000000',
      contentHash: '0x0',
    },
  }),
  useNetwork: () => ({ chain: mockChain, chains: [mockChain] }),
}));

jest.mock('stores', () => ({
  useHookStoreProvider: () => ({
    hooks: { writers: { useLockTokens: jest.fn() } },
  }),
}));

jest.mock('provider/ReadOnlyConnector', () => ({
  READ_ONLY_CONNECTOR_ID: 'readOnly',
}));

jest.mock('contexts/Guilds/orbis', () => ({}));

describe('ProposalCardWinningOption', () => {
  it('renders properly with one action', () => {
    const { container } = render(
      <ProposalCardWinningOption options={[optionsMock]} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders loading component when there are no options', () => {
    const { container } = render(<ProposalCardWinningOption options={null} />);
    expect(container).toMatchSnapshot();
  });

  it('renders a loading component when the votes are not fetched yet', () => {
    const { container } = render(
      <ProposalCardWinningOption options={[optionWithoutVotes]} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders an indicator of the number of actions if the option has more than one action', async () => {
    const { container, findByText } = render(
      <ProposalCardWinningOption options={[optionsWithSeveralActionsMock]} />
    );

    const numberOfActions = await findByText('2');
    const actionsString = await findByText('actions_other');

    expect(numberOfActions).toBeInTheDocument();
    expect(actionsString).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('a tooltip shows after clicking in the action idicator when there are more than one action', async () => {
    const { container, findByLabelText } = render(
      <ProposalCardWinningOption options={[optionsWithSeveralActionsMock]} />
    );

    const expandActionsList: HTMLElement = await findByLabelText(
      'action details button'
    );
    fireEvent.click(expandActionsList);

    const expandedActionsTooltip: HTMLElement = await findByLabelText(
      'expanded actions list tooltip'
    );

    expect(expandedActionsTooltip).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('if the option has only one action, no tooltip shows after clicking it', async () => {
    const { container, findByLabelText, queryByLabelText } = render(
      <ProposalCardWinningOption options={[optionsMock]} />
    );

    const expandActionsList: HTMLElement = await findByLabelText(
      'action details button'
    );
    fireEvent.click(expandActionsList);

    expect(queryByLabelText('expanded actions list tooltip')).toBeFalsy();
    expect(container).toMatchSnapshot();
  });
});

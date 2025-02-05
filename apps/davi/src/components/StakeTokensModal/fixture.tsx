import { BigNumber } from 'ethers';
import { ERC20 } from 'dxdao-contracts/types';
import { ERC20Guild } from 'dxdao-contracts/types/ERC20Guild';
import { StakeTokensModalProps } from './types';
import { GuildConfigProps } from 'stores/modules/common/fetchers/useGuildConfig';

const mockERC20Info = {
  decimals: 18,
  symbol: 'REP',
  name: 'mockName',
  totalSupply: BigNumber.from(0),
};

export const mockStakeTokensFormProps = {
  token: {
    name: 'Mock Token',
    allowance: BigNumber.from(1000000),
    balance: BigNumber.from(1000000),
    info: mockERC20Info,
    contract: {
      approve: () => {},
    } as unknown as ERC20,
  },
  userVotingPower: BigNumber.from(0),
  guild: {
    contract: {} as ERC20Guild,
    config: {
      name: 'mockGuildName',
      totalLocked: BigNumber.from(0),
      tokenVault: 'mockTokenVault',
      lockTime: BigNumber.from(0),
    } as unknown as GuildConfigProps,
    totalLocked: BigNumber.from(0),
  },
  createTransaction: () => {},
  isRepGuild: false,
};

export const mockStakeTokensModalProps: StakeTokensModalProps = {
  isOpen: true,
  onDismiss: () => {},
  token: mockERC20Info,
};

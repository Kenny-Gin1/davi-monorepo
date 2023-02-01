// import { BigNumber } from 'ethers';
import { useQuery } from '@apollo/client';
import {
  getActiveProposalsQuery,
  getActiveProposalsDocument,
} from '.graphclient';
import { useMemo } from 'react';
// import { ZERO_ADDRESS } from 'utils';

export const useGetActiveProposals = (guildAddress: string) => {
  const { data } = useQuery<getActiveProposalsQuery>(
    getActiveProposalsDocument,
    {
      variables: { id: guildAddress?.toLowerCase() },
    }
  );
  const transformedData = useMemo(() => {
    if (!data) return undefined;
    console.log({ data });
    const proposals = data.guild.proposals;
    console.log({ proposals });
    return proposals;
  }, [data]);

  return {
    data: transformedData,
    refetch: () => {},
  };
};

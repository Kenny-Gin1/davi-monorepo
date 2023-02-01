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
    console.log('hej hej');
    return {};
  }, [data]);

  return {
    data: transformedData,
    refetch: () => {},
  };
};

import useIPFSFile from 'hooks/Guilds/ipfs/useIPFSFile';
import { useEffect, useState } from 'react';
import { ProposalMetadata } from 'types/types.guilds';
// import contentHash from '@ensdomains/content-hash';
import { useHookStoreProvider } from 'stores';
import { useOrbisContext } from 'contexts/Guilds/orbis';

function useProposalMetadata(guildId: string, proposalId: `0x${string}`) {
  const {
    hooks: {
      fetchers: { useProposal },
    },
  } = useHookStoreProvider();
  const { data: proposal, error } = useProposal(guildId, proposalId);
  const { orbis } = useOrbisContext();
  const [orbisData, setOrbisData] = useState<any>();

  // Get orbis data
  useEffect(() => {
    let data;
    if (proposal?.contentHash?.startsWith('streamId://')) {
      const fetchData = async () => {
        data = await orbis.getPost(proposal?.contentHash.slice(11));
        if (data.status === 200) setOrbisData(data);
        else setOrbisData(data.error);
      };
      fetchData();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal?.contentHash]);

  const { data: metadata, error: metadataError } =
    useIPFSFile<ProposalMetadata>(
      proposal?.contentHash?.substring(7, proposal?.contentHash?.length + 1)
    );

  if (orbisData) {
    return {
      data: {
        description: orbisData.data?.content?.body,
        voteOptions: orbisData.data?.content?.data.voteOptions,
        link: {
          master: orbisData.data?.master,
          context: orbisData.data?.context,
        },
      },
      error: undefined,
    };
  } else if (error || metadataError) {
    return { error: error || metadataError };
  } else if (!proposal || !metadata) {
    return { error: undefined, data: undefined };
  }

  return { data: metadata };
}

export default useProposalMetadata;

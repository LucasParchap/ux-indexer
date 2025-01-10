'use client';

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatEther, formatUnits } from 'viem';

type BlockInfo = {
    blockNumber: bigint;
    blockHash: string;
    gasUsed: string;
    gasPrice: string;
    burntFees: string;
};

const ChainInfoPage = () => {
    const { chain } = useAccount();
    const publicClient = usePublicClient();
    const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);

    useEffect(() => {
        const fetchBlockInfo = async () => {
            if (!publicClient) {
                console.error('Public client is not available');
                return;
            }

            try {
                const blockNumber = await publicClient.getBlockNumber();
                const block = await publicClient.getBlock({ blockNumber });
                const gasPrice = await publicClient.getGasPrice();
                const baseFeePerGas = block.baseFeePerGas || BigInt(0);
                const burntFees = baseFeePerGas * block.gasUsed;

                setBlockInfo({
                    blockNumber,
                    blockHash: block.hash!,
                    gasUsed: block.gasUsed?.toString() || '0',
                    gasPrice: `${formatUnits(gasPrice, Number('gwei'))} Gwei`,
                    burntFees: `${formatEther(burntFees)} ETH`,
                });
            } catch (error) {
                console.error('Error fetching block info:', error);
            }
        };

        fetchBlockInfo();
    }, [publicClient]);

    if (!blockInfo) {
        return <div>Loading chain information...</div>;
    }

    return (
        <div>
            <h1>Chain Information</h1>
            <p><strong>Connected Chain ID:</strong> {chain?.id}</p>
            <p><strong>Last Block Number:</strong> {blockInfo.blockNumber.toString()}</p>
            <p><strong>Latest Block Hash:</strong> {blockInfo.blockHash}</p>
            <p><strong>Gas Used:</strong> {blockInfo.gasUsed}</p>
            <p><strong>Gas Price:</strong> {blockInfo.gasPrice}</p>
            <p><strong>Burnt Fees:</strong> {blockInfo.burntFees}</p>
        </div>
    );
};

export default ChainInfoPage;

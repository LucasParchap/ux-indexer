'use client';

import { useEffect, useState } from 'react';
import { useNetwork, usePublicClient } from 'wagmi';
import {formatEther, formatUnits} from 'viem';

// Déclarez le type pour blockInfo
type BlockInfo = {
    chainId?: number;
    blockNumber: bigint;
    blockHash: string;
    gasUsed: string;
    gasPrice: string;
    burntFees: string;
};

const ChainInfoPage = () => {
    const { chain } = useNetwork();
    const publicClient = usePublicClient();
    const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);

    useEffect(() => {
        const fetchBlockInfo = async () => {
            try {
                const blockNumber = await publicClient.getBlockNumber();
                const block = await publicClient.getBlock({ blockNumber });
                const gasPrice = await publicClient.getGasPrice();

                const baseFeePerGas = block.baseFeePerGas || BigInt(0);
                const burntFees = baseFeePerGas * block.gasUsed;

                setBlockInfo({
                    chainId: chain?.id,
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
    }, [publicClient, chain]);

    if (!blockInfo) {
        return <div>Loading chain information...</div>;
    }

    return (
        <div>
            <h1>Chain Information</h1>
            <p><strong>Current Chain ID:</strong> {blockInfo.chainId}</p>
            <p><strong>Last Block Number:</strong> {blockInfo.blockNumber.toString()}</p>
            <p><strong>Latest Block Hash:</strong> {blockInfo.blockHash}</p>
            <p><strong>Gas Used:</strong> {blockInfo.gasUsed}</p>
            <p><strong>Gas Price:</strong> {blockInfo.gasPrice}</p>
            <p><strong>Burnt Fees:</strong> {blockInfo.burntFees}</p>
        </div>
    );
};

export default ChainInfoPage;

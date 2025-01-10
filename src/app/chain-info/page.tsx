'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import {mainnet} from "wagmi/chains";

type BlockInfo = {
    chainId: number,
    blockNumber: bigint;
    blockHash: string;
    gasUsed: string;
    gasPrice: string;
    burntFees: string;
};

const ChainInfoPage = () => {
    const publicClient = usePublicClient();
    const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);

    useEffect(() => {
        const fetchBlockInfo = async () => {
            if (!publicClient) {
                console.error('Public client is not available');
                return;
            }

            try {
                const chainId = mainnet.id;
                const blockNumber = await publicClient.getBlockNumber();
                const block = await publicClient.getBlock({ blockNumber });
                const gasPrice = await publicClient.getGasPrice();
                const baseFeePerGas = block.baseFeePerGas || BigInt(0);
                const burntFees = baseFeePerGas * block.gasUsed;

                setBlockInfo({
                    chainId,
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
            <p><strong>Connected Chain ID:</strong> {blockInfo.chainId}</p>
            <p><strong>Last Block Number:</strong> {blockInfo.blockNumber.toString()}</p>
            <p><strong>Latest Block Hash:</strong> {blockInfo.blockHash}</p>
            <p><strong>Gas Used:</strong> {blockInfo.gasUsed}</p>
            <p><strong>Gas Price:</strong> {blockInfo.gasPrice}</p>
            <p><strong>Burnt Fees:</strong> {blockInfo.burntFees}</p>
        </div>
    );
};

export default ChainInfoPage;

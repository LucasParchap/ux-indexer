'use client';

import { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import Link from 'next/link';
import {mainnet} from "wagmi/chains";
import { switchChain } from '@wagmi/core'

const queryClient = new QueryClient();

function Header() {
    const { isConnected, address, isConnecting } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { chain } = useAccount();  // Pour récupérer la chaîne actuelle
    const { data: balance } = useBalance({ address });

    const allowedChains = [1, 11155111];
    const [error, setError] = useState<string | null>(null);

    const isChainAllowed = allowedChains.includes(chain?.id ?? -1);

    useEffect(() => {
        if (!isConnected) {
            return;
        }
        if (!isChainAllowed) {
            setError('You are connected to an unsupported chain. Please switch to Ethereum Mainnet or Sepolia Testnet.');
        } else {
            setError(null);
        }
    }, [chain, isChainAllowed, isConnected]);

    const handleSwitchNetwork = async () => {
        if (switchChain) {
            await switchChain(config, { chainId: mainnet.id })
        }
    };

    return (
        <header className="header">
            <h1>Blockchain App</h1>

            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    <p>{error}</p>
                    <button onClick={handleSwitchNetwork}>Switch to Ethereum Mainnet</button>
                </div>
            )}

            <div>
                <Link href="/chain-info">
                    <button>Go to Chain Info</button>
                </Link>
            </div>

            {!isConnected ? (
                <div>
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => connect({ connector })}
                            disabled={isConnecting}
                        >
                            {isConnecting ? 'Connecting...' : `Connect with ${connector.name}`}
                        </button>
                    ))}
                </div>
            ) : (
                <div>
                    <p>Connected Wallet: {address}</p>
                    <p>Balance: {balance?.formatted} {balance?.symbol}</p>
                    <button onClick={() => disconnect()}>Disconnect</button>
                </div>
            )}
        </header>
    );
}

// Main Layout of the app
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <Header />
                <main>{children}</main>
            </WagmiProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}

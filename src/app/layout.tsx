'use client';

import { ReactNode, useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import Link from 'next/link';
import { mainnet } from 'wagmi/chains';
import { switchChain } from '@wagmi/core';
import './globals.css';
import { usePathname  } from 'next/navigation';

const queryClient = new QueryClient();

function Header() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { isConnected, isConnecting } = useAccount();
    const [isChainInfoPage, setIsChainInfoPage] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/chain-info") {
            setIsChainInfoPage(true);
        } else {
            setIsChainInfoPage(false);
        }
    }, [pathname]);

    return (
        <header className="header">
            <h1>Blockchain App</h1>

            <div className="header-buttons">
                {/* Bouton pour aller à la page Chain Info */}
                {!isChainInfoPage ? (
                    <Link href="/chain-info">
                        <button>Go to Chain Info</button>
                    </Link>
                ) : (
                    <Link href="/">
                        <button>Return to Home</button>
                    </Link>
                )}

                <Link href="/token-data">
                    <button>Go to Token Data</button>
                </Link>

                {/* Connexion / déconnexion */}
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
                        <button onClick={() => disconnect()}>Disconnect</button>
                    </div>
                )}
            </div>
        </header>
    );
}

function Body() {
    const { isConnected, address, chain } = useAccount();
    const { data: balance } = useBalance({ address });

    const allowedChains = [1, 11155111];  // Ethereum Mainnet and Sepolia Testnet
    const [error, setError] = useState<string | null>(null);

    const isChainAllowed = allowedChains.includes(chain?.id ?? -1);

    useEffect(() => {
        if (isConnected && !isChainAllowed) {
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
        <main>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    <p>{error}</p>
                    <button onClick={handleSwitchNetwork}>Switch to Ethereum Mainnet</button>
                </div>
            )}

            {isConnected && !error && (
                <div>
                    <p>Connected Wallet: {address}</p>
                    <p>Balance: {balance?.formatted} {balance?.symbol}</p>
                </div>
            )}
        </main>
    );
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <Header />
                <main>{children}</main>
                <Body />
            </WagmiProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}

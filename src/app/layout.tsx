'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import Link from 'next/link';

const queryClient = new QueryClient();

function Header() {
    const { isConnected, address, isConnecting } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balance } = useBalance({ address });

    return (
        <header className="header">
            <h1>Blockchain App</h1>
            <div>
                {/* Lien pour accéder à la page /chain-info */}
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

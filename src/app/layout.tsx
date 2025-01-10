'use client';

import { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from '../../lib/wagmiClient';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <WagmiConfig config={config}>
            {children}
        </WagmiConfig>
        </body>
        </html>
    );
}

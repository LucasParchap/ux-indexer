'use client';

import { useEffect, useState } from 'react';
import { fetchMetrics, fetchTokens, fetchTokenBalances, MetricsResponse, TokensResponse } from '../../lib/graphqlClient';

export default function TokenDataPage() {
    const [metrics, setMetrics] = useState<MetricsResponse['metrics'][0] | null>(null);
    const [tokens, setTokens] = useState<TokensResponse['tokens']>([]);
    const [address, setAddress] = useState<string>(''); // Adresse entrée par l'utilisateur
    const [balances, setBalances] = useState<{ token: string; balance: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const metricsData = await fetchMetrics();
                setMetrics(metricsData);

                const tokensData = await fetchTokens();
                setTokens(tokensData.tokens);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        loadData();
    }, []);

    const handleFetchBalances = async () => {
        if (!address) {
            setError('Please enter a valid address');
            return;
        }
        setError(null);
        try {
            const balancesData = await fetchTokenBalances(address);
            setBalances(balancesData);
        } catch (err) {
            console.log(address);
            console.error('Error fetching balances:', err);
            setError('Failed to fetch balances. Please try again.');
        }
    };

    return (
        <div>
            <h1>Token Data</h1>

            {/* Metrics Section */}
            {metrics && (
                <div>
                    <h2>Metrics</h2>
                    <p>Total Transfers: {metrics.totalTransfers}</p>
                    <p>Total Holders: {metrics.totalHolders}</p>
                </div>
            )}

            {/* Tokens Section */}
            <h2>Tokens</h2>
            <ul>
                {tokens.map((token) => (
                    <li key={token.id}>
                        {token.name} ({token.symbol}) - Decimals: {token.decimals}
                    </li>
                ))}
            </ul>

            {/* Address Input Section */}
            <h2>Token Balances</h2>
            <input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '300px', padding: '8px', marginRight: '10px' }}
            />
            <button
                onClick={handleFetchBalances}
                style={{
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Get Balances
            </button>

            {/* Error Message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Balances Section */}
            {balances.length > 0 && (
                <ul>
                    {balances.map((balance, index) => (
                        <li key={index}>
                            Token: {balance.token}, Balance: {balance.balance}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

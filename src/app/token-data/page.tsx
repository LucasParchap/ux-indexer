'use client';

import { useState, useEffect } from 'react';

interface TokenInfo {
    symbol: string;
    name: string;
    decimals: number;
    totalSupply: string;
}

interface Metric {
    totalTransfers: number;
    totalHolders: number;
}

interface Balance {
    address: string;
    balance: string;
}

export default function TokenDataPage() {
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [balances, setBalances] = useState<Balance[]>([]);
    const [metrics, setMetrics] = useState<Metric | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tokenResponse = await fetch('/token-data/api/token');
                const tokenData: TokenInfo = await tokenResponse.json();
                setTokenInfo(tokenData);

                const metricsResponse = await fetch('/token-data/api/metrics');
                const metricsData: Metric = await metricsResponse.json();
                setMetrics(metricsData);
            } catch (error) {
                console.error('Error fetching token data:', error);
            }
        };

        fetchData();
    }, []);

    const fetchBalances = async () => {
        try {
            const response = await fetch(`/token-data/api/balance?address=${selectedAddress}`);
            const data: Balance[] = await response.json();
            setBalances(data);
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Token Data</h1>

            {/* Token Information */}
            {tokenInfo ? (
                <section>
                    <h2>Token Information</h2>
                    <p>
                        <strong>Symbol:</strong> {tokenInfo.symbol}
                    </p>
                    <p>
                        <strong>Name:</strong> {tokenInfo.name}
                    </p>
                    <p>
                        <strong>Decimals:</strong> {tokenInfo.decimals}
                    </p>
                    <p>
                        <strong>Total Supply:</strong> {tokenInfo.totalSupply}
                    </p>
                </section>
            ) : (
                <p>Loading token information...</p>
            )}

            {/* Metrics */}
            {metrics ? (
                <section>
                    <h2>Token Metrics</h2>
                    <p>
                        <strong>Total Transfers:</strong> {metrics.totalTransfers}
                    </p>
                    <p>
                        <strong>Total Holders:</strong> {metrics.totalHolders}
                    </p>
                </section>
            ) : (
                <p>Loading metrics...</p>
            )}

            {/* Balances */}
            <section>
                <h2>Token Balances</h2>
                <input
                    type="text"
                    placeholder="Enter address"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                />
                <button onClick={fetchBalances}>Get Balances</button>

                {balances.length > 0 ? (
                    <ul>
                        {balances.map((balance, index) => (
                            <li key={index}>
                                <strong>Address:</strong> {balance.address} - <strong>Balance:</strong>{' '}
                                {balance.balance}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No balances to display.</p>
                )}
            </section>
        </div>
    );
}

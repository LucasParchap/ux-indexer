import { GraphQLClient } from 'graphql-request';

// Créer une instance du client GraphQL
const graphqlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4350/graphql'
);


export interface MetricsResponse {
    metrics: {
        totalTransfers: number;
        totalHolders: number;
    }[];
}


export interface TokensResponse {
    tokens: {
        id: string;
        name: string;
        symbol: string;
        decimals: number;
    }[];
}

export interface TokenBalancesResponse {
    tokenBalances: {
        token: {
            name: string;
            symbol: string;
        };
        balance: string;
    }[];
}

export async function fetchMetrics(): Promise<MetricsResponse['metrics'][0]> {
    const query = `
        query {
            metrics {
                totalTransfers
                totalHolders
            }
        }
    `;
    const response = await graphqlClient.request<MetricsResponse>(query);
    console.log('Metrics response:', response);
    return response.metrics[0];
}

export async function fetchTokens(): Promise<TokensResponse> {
    const query = `
        query {
            tokens {
                id
                name
                symbol
                decimals
            }
        }
    `;
    return graphqlClient.request<TokensResponse>(query);
}
export async function fetchTokenBalances(address: string): Promise<{ token: string; balance: string }[]> {
    const query = `
        query GetTokenBalances($address: String!) {
            tokenBalances(where: { owner_eq: $address }) {
                token {
                    name
                    symbol
                }
                balance
            }
        }
    `;

    const variables = { address };

    try {
        const response: TokenBalancesResponse = await graphqlClient.request<TokenBalancesResponse>(query, variables);
        console.log('Token Balances response:', response);

        return response.tokenBalances.map((item) => ({
            token: `${item.token.name} (${item.token.symbol})`,
            balance: item.balance,
        }));
    } catch (error) {
        console.error('GraphQL fetchTokenBalances Error:', error);
        throw error;
    }
}



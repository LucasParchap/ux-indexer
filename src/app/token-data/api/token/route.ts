export async function GET() {
    const tokenInfo = {
        symbol: 'USDT',
        name: 'Tether',
        decimals: 6,
        totalSupply: '1000000000000',
    };

    return new Response(JSON.stringify(tokenInfo), { status: 200 });
}

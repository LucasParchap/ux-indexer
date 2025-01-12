export async function GET(req: Request) {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');

    if (!address) {
        return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
    }

    // Example balances
    const balances = [
        { address, balance: '1000000000' }, // Replace with actual RPC call
    ];

    return new Response(JSON.stringify(balances), { status: 200 });
}

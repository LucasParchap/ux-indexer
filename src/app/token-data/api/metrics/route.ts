export async function GET() {
    const metrics = {
        totalTransfers: 15000,
        totalHolders: 5000,
    };

    return new Response(JSON.stringify(metrics), { status: 200 });
}

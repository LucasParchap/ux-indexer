export async function GET(req: Request) {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');

    if (!address) {
        return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
    }

    try {
        // Lire l'URL du backend depuis le .env
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!BACKEND_URL) {
            throw new Error("Backend URL is not defined. Please set NEXT_PUBLIC_BACKEND_URL in your .env file.");
        }

        // Effectuer un appel RPC réel ici
        const balances = await fetch(`${BACKEND_URL}/api/token-balances?address=${address}`).then(res => res.json());

        return new Response(JSON.stringify(balances), { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch balances' }), { status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');

    if (!address) {
        return new Response(JSON.stringify({ error: 'Address is required' }), { status: 400 });
    }

    try {
        // Charger l'URL du backend depuis les variables d'environnement
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!BACKEND_URL) {
            throw new Error("Backend URL is not defined. Please set NEXT_PUBLIC_BACKEND_URL in your .env file.");
        }

        // Effectuer un appel RPC au backend pour récupérer les soldes
        const response = await fetch(`${BACKEND_URL}/api/token-balances?address=${address}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch balances: ${response.statusText}`);
        }

        const balances = await response.json();

        return new Response(JSON.stringify(balances), { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch balances', details: error }), { status: 500 });
    }
}

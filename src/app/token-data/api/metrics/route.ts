import express from 'express';

const app = express();

// Exemple : Les données dynamiques sont récupérées depuis une base de données ou d'autres sources
app.get('/api/metrics', async (req, res) => {
    try {
        // Simulation de récupération depuis une base de données ou autre service
        const metrics = {
            totalTransfers: await getTotalTransfers(), // Remplacez par votre logique réelle
            totalHolders: await getTotalHolders(), // Remplacez par votre logique réelle
        };

        res.json(metrics);
    } catch (error) {
        console.error('Erreur lors de la récupération des métriques :', error);
        res.status(500).json({ error: 'Failed to fetch metrics', details: error });
    }
});

// Fonction fictive pour récupérer des métriques
async function getTotalTransfers() {
    // Ajoutez votre logique ici (exemple : requête vers une base de données)
    return 15000; // Exemple
}

async function getTotalHolders() {
    // Ajoutez votre logique ici (exemple : requête vers une base de données)
    return 5000; // Exemple
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

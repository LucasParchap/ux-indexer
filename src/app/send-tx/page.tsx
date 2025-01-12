'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

export default function SendTransactionPage() {
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSendTransaction = async () => {
        setError(null);
        setSuccessMessage(null);

        // Validation des entrées
        if (!ethers.utils.isAddress(recipient)) {
            setError('Invalid recipient address. Please enter a valid Ethereum address.');
            return;
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Invalid amount. Please enter a positive number.');
            return;
        }

        try {
            // Vérifier si un wallet Ethereum est disponible (MetaMask, etc.)
            if (!window.ethereum) {
                setError('No Ethereum wallet detected. Please install MetaMask.');
                return;
            }

            // Connecter le portefeuille
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Créer un provider et un signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Construire et envoyer la transaction
            const transactionResponse = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount),
            });

            // Afficher un message de succès
            setSuccessMessage(`Transaction sent! Hash: ${transactionResponse.hash}`);
            console.log('Transaction sent:', transactionResponse);

            // Attendre la confirmation
            const receipt = await transactionResponse.wait();
            console.log('Transaction confirmed:', receipt);
            setSuccessMessage(`Transaction confirmed! Hash: ${receipt.transactionHash}`);
        } catch (err: any) {
            console.error('Transaction failed:', err);
            setError(err.message || 'Transaction failed. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Send Transaction</h1>

            <div style={{ marginBottom: '10px' }}>
                <label>
                    Recipient Address:
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x1234..."
                        style={{ width: '100%', marginTop: '5px', padding: '8px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>
                    Amount (ETH):
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1.0"
                        style={{ width: '100%', marginTop: '5px', padding: '8px' }}
                    />
                </label>
            </div>

            <button
                onClick={handleSendTransaction}
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Send Transaction
            </button>

            {/* Message d'erreur */}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {/* Message de succès */}
            {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        </div>
    );
}

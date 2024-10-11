'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
    id: string;
    amount: number;
    type: string;
    createdAt: string;
}

interface Bet {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    winAmount: number | null;
}

const DashboardPage = () => {
    const { balance, updateBalance } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [bets, setBets] = useState<Bet[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [betAmount, setBetAmount] = useState<number>(0);
    useEffect(() => {
        fetchTransactions();
        fetchBets();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/my-transactions?page=1&limit=10');
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar as transações', error);
            setErrorMessage('Erro ao buscar as transações.');
        }
    };

    const fetchBets = async () => {
        try {
            const response = await api.get('/my-bets?page=1&limit=10');
            setBets(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar as apostas', error);
            setErrorMessage('Erro ao buscar as apostas.');
        }
    };

    const placeBet = async (betAmount: number) => {
        try {
            const response = await api.post('/bet', { amount: betAmount });
            const { balance } = response.data;
            updateBalance(balance);
            fetchBets();
            fetchTransactions();
        } catch (error) {
            console.error('Erro ao fazer a aposta', error);
            alert('Erro ao fazer a aposta.');
        }
    };

    const cancelBet = async (betID: string) => {
        try {
            await api.delete(`/my-bet/${betID}`);
            fetchBets(); // Recarregar a lista de apostas após cancelamento
        } catch (error) {
            console.error('Erro ao cancelar a aposta', error);
            setErrorMessage('Erro ao cancelar a aposta.');
        }
    };

    return (
        <div>
            <h1>Bem-vindo ao seu Dashboard</h1>
            <h2>Saldo: R$ {balance.toFixed(2)}</h2>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <h3>Minhas Apostas</h3>
            <input type="number" value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} />
            <button onClick={() => placeBet(betAmount)}>Fazer Aposta</button>

            {bets?.length > 0 ? (
                <ul>
                    {bets.map((bet) => (
                        <li key={bet.id}>
                            {bet.createdAt} - Valor: R$ {bet.amount.toFixed(2)} - Status: {bet.status}
                            {bet.winAmount && <span> - Prêmio: R$ {bet.winAmount.toFixed(2)}</span>}
                            <button onClick={() => cancelBet(bet.id)}>Cancelar Aposta</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma aposta encontrada.</p>
            )}

            <h3>Transações</h3>
            {transactions?.length > 0 ? (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            {transaction.createdAt} - {transaction.type} - R$ {transaction.amount.toFixed(2)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma transação encontrada.</p>
            )}
        </div>
    );
};

export default DashboardPage;

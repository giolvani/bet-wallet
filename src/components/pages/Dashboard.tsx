'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Transaction {
    id: string;
    date: string;
    type: string;
    amount: number;
}

const DashboardPage = () => {
    const { isAuthenticated } = useAuth();
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        } else {
            fetchBalance();
            fetchTransactions();
        }
    }, [isAuthenticated, router]);

    const fetchBalance = async () => {
        try {
            const response = await api.get('/my-wallet');
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Erro ao buscar o saldo', error);
            setErrorMessage('Erro ao buscar o saldo.');
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/my-transactions');
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Erro ao buscar as transações', error);
            setErrorMessage('Erro ao buscar as transações.');
        }
    };

    return (
        <div>
            <h1>Bem-vindo ao seu Dashboard</h1>
            <h2>Saldo: R$ {balance.toFixed(2)}</h2>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <h3>Transações</h3>
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            {transaction.date} - {transaction.type} - R$ {transaction.amount.toFixed(2)}
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

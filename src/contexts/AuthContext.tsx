import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface AuthContextData {
    isAuthenticated: boolean;
    isReady: boolean;
    balance: number;
    updateBalance: (balance: number) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('wallet-token');
        const storedBalance = localStorage.getItem('wallet-balance');
        if (storedToken) {
            setToken(storedToken);
            setBalance(storedBalance ? parseFloat(storedBalance) : 0);
            setIsAuthenticated(true);
        }
        setIsReady(true);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password });

            const { accessToken, balance } = response.data;
            localStorage.setItem('wallet-token', accessToken);
            localStorage.setItem('wallet-balance', balance.toString());
            setToken(accessToken);
            setBalance(balance);
            setIsAuthenticated(true);

            router.push('/dashboard');
        } catch (error) {
            console.error('Erro ao fazer login', error);
            alert('Login falhou, verifique suas credenciais.');
        }
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setBalance(0);
        localStorage.removeItem('wallet-token');
        localStorage.removeItem('wallet-balance');
        router.push('/auth/login');
    };

    const updateBalance = (newBalance: number) => {
        setBalance(newBalance);
        localStorage.setItem('wallet-balance', newBalance.toString());
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isReady, login, logout, balance, updateBalance }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

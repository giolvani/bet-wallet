import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';
import { User } from '@/types/User';
import { Token } from '@/types/Token';

interface AuthContextData {
    isAuthenticated: boolean;
    isReady: boolean;
    token: Token | null;
    balance: number;
    user: User | null;
    updateBalance: (balance: number) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [token, setToken] = useState<Token | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken: Token = JSON.parse(localStorage.getItem('wallet-token') || 'null') as Token;
        if (storedToken) {
            setToken(storedToken);
            setBalance(storedToken.balance);
            setUser(storedToken.user);
            setIsAuthenticated(true);
        }
        setIsReady(true);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password });

            const { name, accessToken, balance } = response.data;
            const token: Token = { accessToken, balance, user: { name, email } };

            setToken(token);
            setUser(token.user);
            setBalance(token.balance);
            setIsAuthenticated(true);
            localStorage.setItem('wallet-token', JSON.stringify(token));

            router.push('/dashboard');
        } catch (error) {
            console.error('Erro ao fazer login', error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setBalance(0);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('wallet-token');
        localStorage.removeItem('wallet-balance');
        localStorage.removeItem('wallet-user');
        router.push('/auth/login');
    };

    const updateBalance = (newBalance: number) => {
        setBalance(newBalance);
        localStorage.setItem('wallet-balance', newBalance.toString());
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isReady, login, logout, user, token, balance, updateBalance }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

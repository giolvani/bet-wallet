import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface AuthContextData {
    isAuthenticated: boolean;
    isReady: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('wallet-token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
        setIsReady(true);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', { email, password });

            const { accessToken } = response.data;
            localStorage.setItem('wallet-token', accessToken);
            setToken(accessToken);
            setIsAuthenticated(true);

            router.push('/dashboard');
        } catch (error) {
            console.error('Erro ao fazer login', error);
            alert('Login falhou, verifique suas credenciais.');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('wallet-token');
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isReady, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

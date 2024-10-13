'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Link from 'next/link';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;
        setEmailError('');
        setPasswordError('');

        if (!email) {
            hasError = true;
            setEmailError('Email é obrigatório.');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                hasError = true;
                setEmailError('Email inválido.');
            }
        }
        if (!password) {
            hasError = true;
            setPasswordError('Senha é obrigatória.');
        } else if (password.length < 6) {
            hasError = true;
            setPasswordError('A senha deve ter pelo menos 6 caracteres.');
        }

        if (hasError) {
            return;
        }

        try {
            await login(email, password);
        } catch {
            setErrorMessage('Login falhou. Verifique suas credenciais.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-96">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                </CardHeader>
                <CardContent>
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-4">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertDescription className="pt-1">
                                {errorMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {emailError && <div className="text-xs font-medium text-destructive">{emailError}</div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    placeholder="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {passwordError && <div className="text-xs font-medium text-destructive">{passwordError}</div>}
                            </div>
                            <Button type="submit" className="w-full">
                                Entrar
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col">
                    <Link href="/auth/register" className="text-sm text-blue-600 hover:underline">
                        Não tem uma conta? Cadastre-se
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;

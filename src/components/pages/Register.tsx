'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import api from '@/services/api';

const RegisterPage = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                confirmPassword,
            });

            if (response.status === 200) {
                router.push('/auth/login');
            }
        } catch (error) {
            setErrorMessage('Erro ao registrar. Tente novamente.');
            console.error('Erro de registro', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-96">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Criar Conta</h2>
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
                    <form onSubmit={handleSubmit}>
                        {/* trick to avoid form autofill */}
                        <input type="email" name="email" autoComplete="off" className="fixed -top-80" />
                        <input type="password" name="password" autoComplete="off" className="fixed -top-80" />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Digite seu Nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Digite sua senha novamente"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}
                            <Button type="submit" className="w-full">
                                Registrar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterPage;

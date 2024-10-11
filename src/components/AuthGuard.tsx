'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isReady } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isReady && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isReady, isAuthenticated, router]);

    if (!isReady) {
        return <div>loading...</div>;
    }

    return <>{children}</>;
}

'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, isReady } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isAuthRoute = pathname === '/auth/login' || pathname === '/auth/register';

        if (isReady && !isAuthenticated && !isAuthRoute) {
            router.push('/auth/login');
        }
    }, [isReady, isAuthenticated, router, pathname]);

    if (!isReady) {
        return <div>loading...</div>;
    }

    return <>{children}</>;
}

'use client';

import { ReactElement } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

export default function ProviderWrapper({ children }: { children: ReactElement }) {
    return <>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
    </>;
}

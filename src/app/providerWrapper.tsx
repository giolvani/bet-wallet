'use client';

import { ReactElement } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function ProviderWrapper({ children }: { children: ReactElement }) {
    return <AuthProvider>{children}</AuthProvider>;
}

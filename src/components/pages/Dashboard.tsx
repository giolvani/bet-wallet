'use client';

import { useAuth } from '@/contexts/AuthContext';
import Analytics from '@/components/partials/Analytics';
import Header from '@/components/partials/header';
import Bets from '@/components/partials/Bets';
import Transactions from '@/components/partials/Transactions';

const DashboardPage = () => {
    const { balance } = useAuth();

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Header />
            <Analytics balance={balance} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Bets />
                <Transactions />
            </div>
        </div >
    );
};

export default DashboardPage;

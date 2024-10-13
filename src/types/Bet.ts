export interface Bet {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    winAmount: number | null;
}
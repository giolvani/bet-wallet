import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { CircleBackslashIcon } from "@radix-ui/react-icons";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface Bet {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    winAmount: number | null;
}

export default function Bets() {
    const limit = 5;
    const { updateBalance } = useAuth();
    const [data, setData] = useState<Bet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [betAmount, setBetAmount] = useState('');

    useEffect(() => {
        fetchBets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchBets = async () => {
        try {
            const response = await api.get(`/my-bets?page=${currentPage}&limit=${limit}`);
            setData(response.data.data);
            setTotal(response.data.total);
            setCurrentPage(response.data.page);
        } catch (error) {
            console.error('Erro ao buscar as apostas', error);
        }
    };

    const paginationMessage = useMemo(() => {
        const startItem = (currentPage - 1) * 5 + 1;
        const endItem = Math.min(startItem + 4, total);
        return `Exibindo ${startItem} a ${endItem} de ${total} registros.`;
    }, [currentPage, total]);

    const handlePlaceBet = async () => {
        try {
            const response = await api.post('/bet', { amount: Number(betAmount) });
            updateBalance(response.data.balance);
            setIsDialogOpen(false);
            fetchBets();
        } catch (error) {
            console.error('Erro ao fazer a aposta', error);
        }
    };

    const handleCancelBet = async (betId: string) => {
        try {
            const response = await api.delete(`/my-bet/${betId}`);
            updateBalance(response.data.balance);
            fetchBets();
        } catch (error) {
            console.error('Erro ao cancelar a aposta', error);
        }
    };

    return (
        <>
            <Card className="flex flex-col col-span-1">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Apostas Recentes</CardTitle>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="ml-4">Apostar</Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Fazer uma Aposta</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <Input
                                        type="number"
                                        placeholder="Valor da aposta"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button onClick={handlePlaceBet} disabled={!betAmount}>
                                        Confirmar Aposta
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <CardDescription>&nbsp;</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow">
                    {data.length > 0 ? (
                        <>
                            <div className="space-y-1 flex-grow">
                                {data.map((bet) => (
                                    <div key={bet.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">
                                                <span>{format(new Date(bet.createdAt), 'dd/MM/yyyy HH:mm:ss')}</span>
                                                <span className="ml-4">
                                                    <Badge>{bet.status}</Badge>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-auto text-sm">R$ {Number(bet.amount).toFixed(2)}</div>
                                        <Button onClick={() => handleCancelBet(bet.id)} size="sm" variant="destructive" className="ml-4" disabled={bet.status === 'canceled'}>
                                            <CircleBackslashIcon />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />
                            <div className='mt-auto flex items-center justify-end space-x-2'>
                                <div className="flex-1 text-sm text-muted-foreground">{paginationMessage}</div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
                                    <Button variant="outline" size="sm" disabled={currentPage === Math.ceil(total / limit)} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mt-auto flex"><p className="text-sm">Nenhuma aposta encontrada.</p></div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction } from "@/types/Transaction";
import api from "@/services/api";

export default function Transactions() {
    const limit = 5
    const { balance } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(1);

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, balance]);

    const fetchTransactions = async () => {
        try {
            const response = await api.get(`/my-transactions?page=${currentPage}&limit=${limit}`);
            setData(response.data.data);
            setTotal(response.data.total);
            setCurrentPage(response.data.page);
        } catch (error) {
            console.error('Erro ao buscar as transações', error);
        }
    };

    const paginationMessage = useMemo(() => {
        const startItem = (currentPage - 1) * 5 + 1;
        const endItem = Math.min(startItem + 4, total);
        return `Exibindo ${startItem} a ${endItem} de ${total} registros.`;
    }, [currentPage, total]);

    return <Card className="flex flex-col col-span-1">
        <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
                Você fez 0 transações este mês.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
            {data.length > 0 ? (
                <>
                    <div className="space-y-4 flex-grow">
                        {data.map((transaction) => (
                            <div key={transaction.id} className="flex items-center">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">
                                        <span>{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm:ss')}</span>
                                        <span className="ml-4">
                                            <Badge>{transaction.type}</Badge>
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{transaction.id}</p>
                                </div>
                                <div className="ml-auto text-sm">R$ {Number(transaction.amount).toFixed(2)}</div>
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
                <div className="mt-auto flex"><p className="text-sm">Nenhuma transação encontrada.</p></div>
            )}
        </CardContent>
    </Card>;
}

import { UserNav } from "./UserNav";

export default function Header() {
    return <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo!</h2>
            <p className="text-muted-foreground">
                Confira seu saldo, apostas e transações.
            </p>
        </div>
        <UserNav />
    </div>;
}
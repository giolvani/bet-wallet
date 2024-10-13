import { User } from "./User";

export type Token = {
    accessToken: string;
    balance: number;
    user: User;
}
// lib/types/user.ts

export interface User {
    id: string;
    username: string;
}

export interface NewUser {
    username: string;
    password: string;
}

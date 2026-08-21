export type UserData = {
    id: number;
    username: string;
}

export type UserUpdateRequest = {
    username?: string;
    password?: string;
}
export type createListRequest = {
    title: string;
    description: string;
}

export type getListResponse = {
    id: number;
    title: string;
    description: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export type updateListRequest = {
    id: number;
    title: string;
    description: string;
}
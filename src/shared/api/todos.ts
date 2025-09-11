const BASE_URL = "http://localhost:3000";

export type PaginatedResult<T> = {
    prev: number | null;
    next: number | null;
    first: number;
    last: number;
    pages: number;
    items: number;
    data: T[];
};

type TodoDTO = {
    id: string;
    text: string;
    done: boolean;
};

export const todosApi = {
    getTodoList: async (
        {page, perPage}: {page: Number, perPage?: Number},
        {signal}: {signal: AbortSignal},
    ) => {
        return fetch(`${BASE_URL}/tasks?_page=${page}&_per_page=${perPage}`, {signal}).then(
            res => res.json() as Promise<PaginatedResult<TodoDTO>>
        );
    }
}
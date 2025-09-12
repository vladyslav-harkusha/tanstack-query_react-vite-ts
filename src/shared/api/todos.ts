import {infiniteQueryOptions, queryOptions} from "@tanstack/react-query";
import {jsonApiInstance} from "./api.instance.ts";

const BASE_URL = 'http://localhost:3000';

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
    },
    
    getTodoListPaginateQueryOptions: ({page, perPage}: {page: number, perPage: number}) => {
        return queryOptions({
            queryKey: ['tasks', 'list', { page, perPage }],
            // queryFn: (meta) => todosApi.getTodoList({ page }, meta),
            queryFn: (meta) => jsonApiInstance<PaginatedResult<TodoDTO>>(
                `/tasks?_page=${page}&_per_page=${perPage}`,
                { signal: meta.signal },
            ),
        });
    },
    
    getTodoListInfinityQueryOptions: () => {
        return infiniteQueryOptions({
            queryKey: ['tasks', 'list'],
            queryFn: (meta) => jsonApiInstance<PaginatedResult<TodoDTO>>(
                `/tasks?_page=${meta.pageParam}&_per_page=10`,
                { signal: meta.signal },
            ),
            initialPageParam: 1,
            getNextPageParam: (result) => result.next,
            select: result => result.pages.flatMap(page => page.data)
        });
    },
}
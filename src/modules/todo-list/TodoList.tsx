import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";
import {useState} from "react";

export function TodoListInfinityScroll() {
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [enabled, setEnabled] = useState(false);
    
    const { data: todoResponse, error, isLoading, status, fetchStatus, isPlaceholderData } = useQuery({
        queryKey: ['tasks', 'list', { page, perPage }],
        queryFn: (meta) => todosApi.getTodoList({page, perPage}, meta),
        placeholderData: keepPreviousData,
        enabled: enabled,
    });
    
    console.log("status ", status);
    console.log("fetchStatus ", fetchStatus);
    
    if (isLoading) {
        return <div>Loading...</div>
    }
    
    if (error) {
        return <div>Error: { JSON.stringify(error) }</div>
    }
    
    return (
        <div className="p-5 mx-auto mt-10 max-w-[500px]">
            <h2 className="text-gray-600 text-2xl font-bold underline mb-5">Todo List</h2>
            <button onClick={() => setEnabled(prev => !prev)}>Toggle enabled</button>
            
            <ul className={"flex flex-col gap-4" + (isPlaceholderData ? " opacity-50" : "")}>
                {todoResponse?.data.map(({ id, text, done }) => (
                    <li key={id} className="border border-slate-300 rounded p-3 text-slate-600">
                        <p>{id}: --- {text} --- {done ? "done" : "to do"}</p>
                    </li>
                ))}
            </ul>
            
            <div className="flex gap-2 mt-4">
                <button
                    className="p-3 rounded border border-teal-500 cursor-pointer"
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                >
                    Prev
                </button>
                <button
                    className="p-3 rounded border border-teal-500 cursor-pointer"
                    onClick={() => setPage(prev => Math.min(prev + 1, todoResponse?.pages ?? 1))}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
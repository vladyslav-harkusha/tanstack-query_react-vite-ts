import {useTodoList} from "./useTodoList.tsx";
import {useMutation} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";
import {nanoid} from "nanoid";

export function TodoListInfinityScroll() {
    const { cursor, error, isLoading, todoResponse } = useTodoList();
    
    const createTodoMutation = useMutation({
        mutationFn: todosApi.createTodo,
    });
    
    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const text = String(formData.get("text"));
        
        createTodoMutation.mutate({
            id: nanoid(),
            done: false,
            text,
            userId: 1,
        });
        
        e.currentTarget.reset();
    };
    
    if (isLoading) {
        return <div>Loading...</div>
    }
    
    if (error) {
        return <div>Error: { JSON.stringify(error) }</div>
    }
    
    return (
        <div className="p-5 mx-auto mt-10 max-w-[500px]">
            <h2 className="text-gray-600 text-2xl font-bold underline mb-5">Todo List</h2>
            
            <form onSubmit={handleCreate} className="flex gap-2 mb-5">
                <input type="text" name="text" className="border-2 border-teal-500 rounded p-2"/>
                <button className="border-2 border-teal-500 rounded p-2 cursor-pointer hover:bg-teal-200 transition duration-300">
                    Create
                </button>
            </form>
            
            <ul className={"flex flex-col gap-4"}>
                {todoResponse?.map(({ id, text, done }) => (
                    <li key={id} className="border border-slate-300 rounded p-3 text-slate-600">
                        <p>{id}: --- {text} --- {done ? "done" : "to do"}</p>
                    </li>
                ))}
            </ul>
            
            {cursor}
        </div>
    );
}

import {useTodoList} from "./useTodoList.tsx";

export function TodoListInfinityScroll() {
    const { cursor, error, isLoading, todoResponse } = useTodoList();
    
    if (isLoading) {
        return <div>Loading...</div>
    }
    
    if (error) {
        return <div>Error: { JSON.stringify(error) }</div>
    }
    
    return (
        <div className="p-5 mx-auto mt-10 max-w-[500px]">
            <h2 className="text-gray-600 text-2xl font-bold underline mb-5">Todo List</h2>
            
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

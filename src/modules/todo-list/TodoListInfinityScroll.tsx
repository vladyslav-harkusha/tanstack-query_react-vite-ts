import {useInfiniteQuery} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";
import {useCallback, useRef, useState} from "react";

export function TodoListInfinityScroll() {
    const [enabled, setEnabled] = useState(false);
    
    const {
        data: todoResponse,
        error,
        isLoading,
        isPlaceholderData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['tasks', 'list'],
        queryFn: (meta) => todosApi.getTodoList({page: meta.pageParam}, meta),
        enabled: enabled,
        initialPageParam: 1,
        getNextPageParam: (result) => result.next,
        select: result => result.pages.flatMap(page => page.data)
    });
    
    const cursorRef = useIntersection(async () => {
        await fetchNextPage();
    })
    
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
                {todoResponse?.map(({ id, text, done }) => (
                    <li key={id} className="border border-slate-300 rounded p-3 text-slate-600">
                        <p>{id}: --- {text} --- {done ? "done" : "to do"}</p>
                    </li>
                ))}
            </ul>
            
            <div className="flex gap-2 mt-4" ref={cursorRef}>
                {!hasNextPage && <div>No data for loading</div>}
                {isFetchingNextPage && <div>Loading...</div>}
            </div>
        </div>
    );
}

export function useIntersection(onIntersect: () => void) {
    const unsubscribe = useRef(() => {})
    
    return useCallback((el: HTMLDivElement | null) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(intersection => {
                if (intersection.isIntersecting) {
                    onIntersect();
                }
            })
        });
        
        if (el) {
            observer.observe(el);
            unsubscribe.current = () => observer.disconnect();
        } else {
            unsubscribe.current();
        }
    }, []);
}

import {useInfiniteQuery} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";
import {useCallback, useRef} from "react";

export function useTodoList() {
    const {
        data: todoResponse,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        ...todosApi.getTodoListInfinityQueryOptions(),
    });
    
    const cursorRef = useIntersection(async () => {
        await fetchNextPage();
    })
    
    const cursor = (
        <div className="flex gap-2 mt-4" ref={cursorRef}>
            {!hasNextPage && <div>No data for loading</div>}
            {isFetchingNextPage && <div>Loading...</div>}
        </div>
    );
    
    return {error, todoResponse, isLoading, cursor };
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
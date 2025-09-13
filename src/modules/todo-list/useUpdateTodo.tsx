import {useMutation, useQueryClient} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";

export function useUpdateTodo() {
    const queryClient = useQueryClient();
    
    const updateTodoMutation = useMutation({
        mutationFn: todosApi.updateTodo,
        
        // When mutate is called:
        onMutate: async (newTodo) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: [todosApi.baseKey] });
            
            // Snapshot the previous value
            const previousTodos = queryClient.getQueryData(
                todosApi.getTodoListQueryOptions().queryKey
            );
            
            // Optimistically update to the new value
            queryClient.setQueryData(
                todosApi.getTodoListQueryOptions().queryKey,
                (old) => old?.map((todo) =>
                    todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
                ),
            );
            
            // Return a context object with the snapshotted value
            return { previousTodos }
        },
        // If the mutation fails,
        // use the context returned from onMutate to roll back
        onError: (_, __, context) => {
            if (context) {
                queryClient.setQueryData(todosApi.getTodoListQueryOptions().queryKey, context.previousTodos)
            }
        },
        // Always refetch after error or success:
        onSettled: () => queryClient.invalidateQueries({ queryKey: [todosApi.baseKey] }),
    });
    
    const toggleTodo = (id: string, done: boolean) => {
        updateTodoMutation.mutate({
            id,
            done: !done,
        });
    };
    
    return {
        toggleTodo,
    }
}
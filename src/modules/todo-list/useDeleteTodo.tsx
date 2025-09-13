import {useMutation, useQueryClient} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    
    const deleteTodoMutation = useMutation({
        mutationFn: todosApi.deleteTodo,
        async onSettled() {
            queryClient.invalidateQueries({ queryKey: [todosApi.baseKey] })
        },
        async onSuccess(_, deletedId) {
            queryClient.setQueryData(
                todosApi.getTodoListQueryOptions().queryKey,
                todos => todos?.filter(todo => todo.id !== deletedId)
            );
        }
    });
    
    return {
        handleDelete: deleteTodoMutation.mutate,
        // isDeleteTodoPending: deleteTodoMutation.isPending,
        getIsPending: (todoId: string) => deleteTodoMutation.isPending && deleteTodoMutation.variables === todoId,
    }
}
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";
import {nanoid} from "nanoid";

export function useCreateTodo() {
    const queryClient = useQueryClient();
    
    const createTodoMutation = useMutation({
        mutationFn: todosApi.createTodo,
        // onSuccess() {
        //     queryClient.invalidateQueries({ queryKey: [todosApi.baseKey] })
        //     // queryClient.invalidateQueries(todosApi.getTodoListQueryOptions())
        // },
        // onError() {},
        async onSettled() { // перезапросит в любом случае, посте ошибки тоже
            await queryClient.invalidateQueries({ queryKey: [todosApi.baseKey] })
            // await queryClient.invalidateQueries(todosApi.getTodoListQueryOptions())
        }
    });
    
    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = formData.get("text");
        
        if (text) {
            createTodoMutation.mutate({
                id: nanoid(),
                done: false,
                text: String(text).trim(),
                userId: 1,
            });
        }
        
        e.currentTarget.reset();
    };
    
    return {
        handleCreate,
        isNewTodoPending: createTodoMutation.isPending,
    }
}
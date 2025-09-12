import {useMutation, useQueryClient} from "@tanstack/react-query";
import {todosApi} from "../../shared/api/todos.ts";
import {nanoid} from "nanoid";

export function useCreateTodo() {
    const queryClient = useQueryClient();
    
    const createTodoMutation = useMutation({
        mutationFn: todosApi.createTodo,
    });
    
    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = String(formData.get("text"));
        
        createTodoMutation.mutate({
            id: nanoid(),
            done: false,
            text,
            userId: 1,
        }, {
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: [todosApi.baseKey],
                });
            }
        });
        
        e.currentTarget.reset();
    };
    
    return {
        handleCreate,
    }
}
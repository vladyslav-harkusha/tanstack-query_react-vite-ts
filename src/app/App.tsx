import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../shared/api/query-client.ts";
// import {TodoList} from "../modules/todo-list/TodoList.tsx";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TodoListInfinityScroll} from "../modules/todo-list/TodoListInfinityScroll.tsx";

export function App() {

    return (
        <QueryClientProvider client={queryClient}>
            {/*<TodoList />*/}
            <TodoListInfinityScroll />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

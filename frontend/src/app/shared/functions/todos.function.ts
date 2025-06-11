import { Todo, TodoState, TodoStatus } from "../models/dashboard.models";


export function calculateOngoingTasks(
    todos: Todo[],
    todoStates: TodoState[],
    todoStatuses: TodoStatus[],
    statusOfTodo: string
  ): number {
    return todos.filter(todo => {
      const state = todoStates.find(s => s.id === todo.currentStateId);
      if (state) {
        const status = todoStatuses.find(s => s.id === state.statusId);
        return status?.statusName.toLowerCase() === statusOfTodo;
      }
      return false;
    }).length;
  }

export function calculateCompletionRate(
    todos: Todo[],
    todoStates: TodoState[],
    todoStatuses: TodoStatus[]
  ): number {
    const completedTodos = todos.filter(todo => {
      const state = todoStates.find(s => s.id === todo.currentStateId);
      if (state) {
        const status = todoStatuses.find(s => s.id === state.statusId);
        return status?.statusName === 'completed';
      }
      return false;
    });

    return todos.length ? (completedTodos.length / todos.length) * 100 : 0;
  }
import { createSignal, For } from "solid-js";
import { createTodo } from "./helpers/createTodo";
import { type FormSubmitEvent, type ListName, type Todo } from "./types";
import { TodoSet, type TodoSetProps } from "./components/TodoSet";
import { useDexie } from "./hooks/useDexie";
import { TodoForm } from "./components/TodoForm";
import { LIST_FORM_SCHEMA, TODO_FORM_SCHEMA } from "./constants";
import { getFormData } from "./helpers/getFormData";
import { ListSelector } from "./components/ListSelector";

export function App() {
  const [selectedList, setSelectedList] = createSignal<ListName>("reminders");
  const [showDependentsForTodo, setShowDependentsForTodo] = createSignal<
    Record<Todo["id"], boolean>
  >({});

  const [lists, todos, { addTodo, handleTodoCheck, addList }] = useDexie();

  function handleShowDependent(id: Todo["id"]) {
    setShowDependentsForTodo((curShownDependents) => ({
      ...curShownDependents,
      [id]: !curShownDependents[id],
    }));
  }

  const independentTodos = () =>
    todos()
      .filter((i) => !i.dependsOn)
      .sort((a, b) => a.createdAt - b.createdAt);

  const getDependentProps = (id?: Todo["id"]): TodoSetProps | undefined => {
    const dependentTodo = todos().find((i) => i.id === id);

    if (dependentTodo) {
      return {
        todoProps: {
          todo: dependentTodo,
          class: "my-3",
          onShowDependentClick: handleShowDependent,
          onCheck: (checked) => handleTodoCheck(checked, dependentTodo),
        },
        dependentProps: getDependentProps(dependentTodo.dependent),
        showDependent: showDependentsForTodo()[dependentTodo.id],
      };
    }
  };

  function handleFormSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = getFormData(form);

    const res = TODO_FORM_SCHEMA.safeParse(data);
    if (!res.success) {
      console.error(res.error);
      return;
    }

    const todo = createTodo(res.data);

    addTodo(todo)
      .then(() => form.reset())
      .catch((error) => console.error("error adding todo =>", error));
  }

  function handleListFormSubmit(event: FormSubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = getFormData(form);

    const parsed = LIST_FORM_SCHEMA.safeParse(data);
    if (parsed.success) {
      addList(parsed.data.listName)
        .then(() => form.reset())
        .catch((error) => console.error(error));
    }
  }

  const availableOptions = () => todos().filter((i) => !i.dependent);

  return (
    <div class="flex h-screen max-h-screen">
      {/* Lists */}
      <div class="flex flex-col items-center justify-center gap-3 w-80 border-2 border-orange-400">
        <div class="flex flex-wrap gap-2">
          <For each={lists()}>
            {(list) => (
              <ListSelector
                list={list}
                count={2}
                selected={selectedList() === list.name}
                onClick={() => setSelectedList(list.name)}
              />
            )}
          </For>
        </div>
        <div class="flex flex-col border-2 items-center border-purple-300">
          <h2>Add List</h2>
          <form
            class="flex flex-col gap-3 border border-blue-700 p-3 rounded-md"
            onSubmit={handleListFormSubmit}
          >
            <input name="listName" type="text" />
            <button class="bg-blue-400 p-3 rounded-md">ADD</button>
          </form>
        </div>
      </div>
      {/* Content */}
      <div class="flex flex-1 gap-2 border border-green-400">
        <For each={independentTodos()}>
          {(todo) => (
            <div class="border border-red-300 p-2">
              <TodoSet
                todoProps={{
                  todo,
                  class: "my-3",
                  onShowDependentClick: handleShowDependent,
                  onCheck: (checked) => handleTodoCheck(checked, todo),
                }}
                dependentProps={getDependentProps(todo.dependent)}
                showDependent={showDependentsForTodo()[todo.id]}
              />
            </div>
          )}
        </For>
        {/* todo form */}
        <div class="flex border-2 border-lime-200">
          <TodoForm
            onSubmit={handleFormSubmit}
            dependentSelectProps={{
              name: "dependsOn",
              options: availableOptions().map((option) => ({
                id: option.id,
                value: option.description,
              })),
            }}
            listSelectProps={{
              name: "list",
              options: lists().map((item) => ({
                id: item.name,
                value: item.name,
              })),
            }}
          />
        </div>
      </div>
    </div>
  );
}

import { For } from "solid-js";
import { createTodo } from "./helpers/createTodo";
import type { FormSubmitEvent } from "./types";
import { useDexie } from "./hooks/useDexie";
import { TodoForm } from "./components/TodoForm";
import { LIST_FORM_SCHEMA, TODO_FORM_SCHEMA } from "./constants";
import { getFormData } from "./helpers/getFormData";
import { ListSelector } from "./components/ListSelector";
import { TodoComp } from "./components/Todo";

export function App() {
  const [
    listsCount,
    todos,
    selectedList,
    { addTodo, handleTodoCheck, addList, chooseList },
  ] = useDexie();

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

  // has been defaulted to reminders
  const chosenList = () => selectedList()?.name || "reminders";

  return (
    <div class="flex h-screen max-h-screen">
      {/* Lists */}
      <div class="flex flex-col items-center justify-center gap-3 w-80 border-2 border-orange-400">
        <div class="flex flex-wrap gap-2">
          <For each={listsCount()}>
            {({ list, todoCount }) => (
              <ListSelector
                list={list}
                todoCount={todoCount}
                selected={chosenList() === list.name}
                onClick={() => chooseList(list.name)}
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
      <div class="flex flex-col gap-2 border border-green-400">
        <For each={todos()}>
          {(todo) => (
            <TodoComp
              todo={todo}
              onCheck={(checked) => handleTodoCheck(checked, todo)}
            />
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
              options: listsCount().map(({ list }) => ({
                id: list.name,
                value: list.name,
              })),
            }}
          />
        </div>
      </div>
    </div>
  );
}

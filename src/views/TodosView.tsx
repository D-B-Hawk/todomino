import { For, Show } from "solid-js";
import type { FormSubmitEvent, Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce } from "@/hooks";
import { TODO_FORM_SCHEMA } from "@/constants";
import { isRestrictedListName, getFormData, createTodo } from "@/helpers";
import { TodoComp, TodoForm, type SelectOption } from "@/components";

export function TodosView() {
  const [
    { lists, chosenListTodos, chosenListName },
    { addTodo, handleTodoCheck },
  ] = useDexieCtx();

  // returns  an array of select options for lists
  // that are not readonly
  const listSelectOptions = () =>
    lists().reduce<SelectOption[]>((prev, { name }) => {
      if (!isRestrictedListName(name)) {
        const option = {
          id: name,
          value: name,
        };

        // make the selected list the first option when
        // creating the todo
        if (name === chosenListName()) {
          prev.unshift(option);
        } else {
          prev.push(option);
        }
      }
      return prev;
    }, []);

  // return an array of select options for todos that
  // currently have no todo that is dependent on it
  const availableDependentOptions = () =>
    chosenListTodos().reduce<SelectOption[]>((prev, cur) => {
      if (!cur.dependent) {
        prev.push({
          id: cur.id,
          value: cur.description,
        });
      }
      return prev;
    }, []);

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

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

  return (
    <div class="flex flex-col overflow-y-auto gap-2 p-4">
      <For each={chosenListTodos()}>
        {(todo) => (
          <TodoComp
            todo={todo}
            onCheck={(checked) => debouncedCheck(checked, todo)}
          />
        )}
      </For>
      {/* todo form */}
      <Show when={!isRestrictedListName(chosenListName())}>
        <div class="flex border-2 border-lime-200">
          <TodoForm
            onSubmit={handleFormSubmit}
            listSelectProps={{
              name: "list",
              options: listSelectOptions(),
            }}
            dependentSelectProps={{
              name: "dependsOn",
              options: availableDependentOptions(),
              withBlankOption: true,
            }}
          />
        </div>
      </Show>
    </div>
  );
}

import { createTodo } from "./helpers/createTodo";
import { TodoKey, type FormSubmitEvent } from "./types";
import { useDexie } from "./hooks/useDexie";
// import { TodoForm } from "./components/TodoForm";
import { TODO_FORM_SCHEMA } from "./constants";
import { getFormData } from "./helpers/getFormData";
// import { ListSelector } from "./components/ListSelector";
// import { TodoComp } from "./components/Todo";
import type { Option } from "./components/SelectInput";
// import { useAsyncDebounce } from "./hooks/useAsyncDebounce";
import { ListView } from "./views/ListView";
import { noop } from "./helpers/noop";
import { TodosView } from "./views/TodosView";

export function App() {
  const [
    listsCount,
    todos,
    selectedList,
    { addTodo, handleTodoCheck, chooseList },
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

  // function handleListFormSubmit(event: FormSubmitEvent) {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   const data = getFormData(form);

  //   const parsed = LIST_FORM_SCHEMA.safeParse(data);
  //   if (parsed.error) {
  //     console.error(parsed.error);
  //     return;
  //   }

  //   addList(parsed.data.listName)
  //     .then(() => form.reset())
  //     .catch((error) => console.error(error));
  // }

  const availableOptions = () =>
    todos().reduce<Option[]>((prev, cur) => {
      if (!cur[TodoKey.DEPENDENT]) {
        prev.push({
          id: cur[TodoKey.ID],
          value: cur[TodoKey.DESCRIPTION],
        });
      }
      return prev;
    }, []);

  const todoListOptions = () =>
    listsCount().reduce<Option[]>((prev, cur) => {
      const curListName = cur.list.name;

      if (curListName !== "completed") {
        const option = {
          id: cur.list.name,
          value: cur.list.name,
        };

        // make the selected list the first option when
        // creating the todo
        if (curListName === selectedList()) {
          prev.unshift(option);
        } else {
          prev.push(option);
        }
      }
      return prev;
    }, []);

  return (
    <div class="flex h-screen max-h-screen">
      {/* Lists */}
      <ListView
        selectedList={selectedList()}
        listCounts={listsCount()}
        onChooseList={chooseList}
        onAddList={noop}
      />
      {/* Todos */}
      <TodosView
        selectedListName={selectedList()}
        todos={todos()}
        onTodoCheck={handleTodoCheck}
        availableDependentOptions={availableOptions()}
        listSelectOptions={todoListOptions()}
        onTodoFormSubmit={handleFormSubmit}
      />
    </div>
  );
}

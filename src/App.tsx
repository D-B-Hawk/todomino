import { createTodo } from "./helpers/createTodo";
import { TodoKey, type FormSubmitEvent } from "./types";
import { useDexie, useToggle } from "./hooks";
import { LIST_FORM_SCHEMA, TODO_FORM_SCHEMA } from "./constants";
import { getFormData } from "./helpers/getFormData";
import type { Option } from "./components/SelectInput";
import { ListView } from "./views/ListView";
import { TodosView } from "./views/TodosView";
import { Modal } from "./components/Modal";
import { AddListForm } from "./components/AddListForm";

export function App() {
  const [showAddListMenu, { toggle }] = useToggle();
  const [
    listsCount,
    todos,
    selectedList,
    { addTodo, handleTodoCheck, chooseList, addList },
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
    if (parsed.error) {
      console.error(parsed.error);
      return;
    }

    addList(parsed.data)
      .then(() => {
        form.reset();
        toggle();
      })
      .catch((error) => console.error(error));
  }

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
    <>
      <div class="flex h-screen max-h-screen">
        {/* Lists */}
        <ListView
          selectedList={selectedList()}
          listCounts={listsCount()}
          onChooseList={chooseList}
          onAddList={toggle}
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
      <Modal showModal={showAddListMenu()}>
        <AddListForm
          onCloseForm={toggle}
          onSubmit={handleListFormSubmit}
          onOutsideFormClick={toggle}
        />
      </Modal>
    </>
  );
}

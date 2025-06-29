import { useToggle } from "./hooks";
import { ListView } from "./views/ListView";
import { TodosView } from "./views/TodosView";
import { Modal } from "./components/Modal";
import { AddListForm } from "./components/AddListForm";

export function App() {
  const [showAddListMenu, { toggle }] = useToggle();

  return (
    <>
      <div class="flex h-screen max-h-screen overflow-hidden">
        <ListView onAddList={toggle} />
        <TodosView />
      </div>
      <Modal showModal={showAddListMenu()}>
        <AddListForm
          onCloseForm={toggle}
          onOutsideFormClick={toggle}
          onFormSubmitSuccess={toggle}
        />
      </Modal>
    </>
  );
}

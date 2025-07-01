import { createSignal, Show } from "solid-js";
import { useToggle } from "./hooks";
import { ListView } from "./views/ListView";
import { TodosView } from "./views/TodosView";
import { Modal } from "./components/Modal";
import { AddListForm } from "./components/AddListForm";
import { ConfirmListDelete } from "./components/ConfirmListDelete";

enum ListAction {
  ADD_LIST = "addList",
  DELETE_LIST = "deleteList",
}

export function App() {
  const [showModal, { toggle: toggleModal }] = useToggle();
  const [modalContent, setModalContent] = createSignal<ListAction>(
    ListAction.ADD_LIST,
  );

  function handleListDelete() {
    toggleModal();
  }

  function handleListAction(action: ListAction) {
    setModalContent(action);
    toggleModal();
  }

  return (
    <>
      <div class="flex h-screen max-h-screen overflow-hidden">
        <ListView
          onAddList={() => handleListAction(ListAction.ADD_LIST)}
          onDeleteList={() => handleListAction(ListAction.DELETE_LIST)}
        />
        <TodosView />
      </div>
      <Modal showModal={showModal()}>
        <Show when={modalContent() === ListAction.ADD_LIST}>
          <AddListForm
            onCloseForm={toggleModal}
            onOutsideFormClick={toggleModal}
            onFormSubmitSuccess={toggleModal}
          />
        </Show>
        <Show when={modalContent() === ListAction.DELETE_LIST}>
          <ConfirmListDelete
            onConfirmDelete={handleListDelete}
            onOutsidePopupClick={toggleModal}
          />
        </Show>
      </Modal>
    </>
  );
}

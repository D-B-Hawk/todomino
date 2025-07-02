import { createSignal, Show } from "solid-js";
import { useDexie, useToggle } from "./hooks";
import { ListView } from "./views/ListView";
import { TodosView } from "./views/TodosView";
import { Modal } from "./components/Modal";
import { AddListForm } from "./components/AddListForm";
import { ConfirmListDelete } from "./components/ConfirmListDelete";
import type { ListName } from "./types";

enum ListAction {
  ADD_LIST = "addList",
  DELETE_LIST = "deleteList",
}

export function App() {
  const [showModal, { toggle: toggleModal }] = useToggle();
  const [modalContent, setModalContent] = createSignal<ListAction>(
    ListAction.ADD_LIST,
  );
  const [listToDelete, setListToDelete] = createSignal<ListName>();

  const [, { deleteList }] = useDexie();

  function handleListDelete() {
    const doomedList = listToDelete();
    if (!doomedList) {
      console.error("no list to delete");
      return;
    }

    deleteList(doomedList)
      .then(toggleModal)
      .catch((error) => console.error(error));
  }

  function handleListAction(action: ListAction, listName?: ListName) {
    if (listName) {
      setListToDelete(listName);
    }
    setModalContent(action);
    toggleModal();
  }

  return (
    <>
      <div class="flex h-screen max-h-screen overflow-hidden">
        <ListView
          onAddList={() => handleListAction(ListAction.ADD_LIST)}
          onDeleteList={(listName) =>
            handleListAction(ListAction.DELETE_LIST, listName)
          }
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

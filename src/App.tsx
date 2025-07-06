import { createSignal, Show } from "solid-js";
import { useToggle, useMatchMedia } from "@/hooks";
import { ListView, TodosView } from "@/views";
import { Modal, AddListForm, ConfirmListDelete } from "@/components";
import type { ListName } from "@/types";
import { useDexieCtx } from "@/context";

enum ListAction {
  ADD_LIST = "addList",
  DELETE_LIST = "deleteList",
}

export function App() {
  const prefersDarkTheme = useMatchMedia("(prefers-color-scheme: dark)");
  const [showModal, { toggle: toggleModal }] = useToggle();
  const [modalContent, setModalContent] = createSignal<ListAction>(
    ListAction.ADD_LIST,
  );
  const [listToDelete, setListToDelete] = createSignal<ListName>();

  const [, { deleteList }] = useDexieCtx();

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
    <div class={prefersDarkTheme() ? "dark" : ""}>
      <div class="flex h-screen max-h-screen overflow-hidden dark:bg-black">
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
    </div>
  );
}

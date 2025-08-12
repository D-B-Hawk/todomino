import { createSignal, Show } from "solid-js";
import { useToggle } from "@/hooks";
import { ListView, TodosView } from "@/views";
import { Modal, AddListForm, ConfirmListDelete } from "@/components";
import type { ListAction, ListName } from "@/types";
import { useDexieCtx } from "@/context";
import { INITIAL_LISTS_MAP } from "@/constants/lists";

export function App() {
  const [showModal, { toggle: toggleModal }] = useToggle();
  const [modalContent, setModalContent] = createSignal<ListAction>("ADD_LIST");
  const [listToDelete, setListToDelete] = createSignal<ListName>();

  const [, { deleteList, chooseList }] = useDexieCtx();

  function handleListDelete() {
    const doomedList = listToDelete();
    if (!doomedList) {
      console.error("no list to delete");
      return;
    }

    deleteList(doomedList)
      .then(() => {
        toggleModal();
        chooseList(INITIAL_LISTS_MAP["reminders"]);
      })
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
      <div class="flex h-screen max-h-screen overflow-hidden dark:bg-black">
        <ListView
          onAddList={() => handleListAction("ADD_LIST")}
          onDeleteList={(listName) => handleListAction("DELETE_LIST", listName)}
        />
        <TodosView />
      </div>
      <Modal showModal={showModal()}>
        <Show when={modalContent() === "ADD_LIST"}>
          <AddListForm
            onCloseForm={toggleModal}
            onOutsideFormClick={toggleModal}
            onFormSubmitSuccess={toggleModal}
          />
        </Show>
        <Show when={modalContent() === "DELETE_LIST" && listToDelete()}>
          {(listName) => (
            <ConfirmListDelete
              listName={listName()}
              onConfirmDelete={handleListDelete}
              onOutsidePopupClick={toggleModal}
            />
          )}
        </Show>
      </Modal>
    </>
  );
}

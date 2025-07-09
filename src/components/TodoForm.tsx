import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { z } from "zod/v4";

import { SelectInput, type SelectOption } from "./SelectInput";
import { TextField } from "./TextField";
import type { FormSubmitEvent } from "@/types";
import { createTodo, getFormData, isReadOnlyListName } from "@/helpers";
import { LIST_UNION } from "@/constants/lists";
import { useDexieCtx } from "@/context";

export const TODO_FORM_SCHEMA = z.object({
  description: z.string().min(1),
  dependsOn: z.string().optional(),
  list: LIST_UNION,
});

type TodoFormProps = JSX.HTMLAttributes<HTMLFormElement>;

export function TodoForm(props: TodoFormProps) {
  const [local, formProps] = splitProps(props, ["class"]);

  const [{ lists, chosenListTodos, chosenList }, { addTodo }] = useDexieCtx();

  // returns  an array of select options for lists
  // that are not readonly
  const listSelectOptions = () =>
    lists().reduce<SelectOption[]>((prev, { name }) => {
      if (!isReadOnlyListName(name)) {
        const option = {
          id: name,
          value: name,
        };

        // make the selected list the first option when
        // creating the todo
        if (name === chosenList()?.name) {
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

  return (
    <form
      class={twMerge("flex flex-col gap-3", local.class)}
      onSubmit={handleFormSubmit}
      {...formProps}
    >
      <TextField
        name="description"
        labelProps={{ label: "Description" }}
        placeholder="New TODO"
        required
      />
      <SelectInput
        name="list"
        labelProps={{ label: "List:" }}
        options={listSelectOptions()}
      />
      <SelectInput
        name="dependsOn"
        labelProps={{ label: "Dependent:" }}
        options={availableDependentOptions()}
      />
      <button class="bg-blue-400 rounded-md text-white p-2 px-4 w-fit self-center cursor-pointer">
        submit
      </button>
    </form>
  );
}

"use client";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { TodoRecord } from "@/lib/db/schema";
import { todoAction } from "@/app/actions";
import { filter, intent, name } from "@/app/constants";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MouseEventHandler } from "react";

export interface TodoState {
  todos: Pick<TodoRecord, "id" | "text" | "completed">[];
  activeFilter: keyof typeof filter;
}

const FilterLinks = ({ activeFilter }: { activeFilter: TodoState["activeFilter"] }) => {
  const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    window.history.pushState(null, "", e.currentTarget.href);
  };
  return Object.values(filter).map((filter) => (
    <Link
      key={filter}
      data-selected={filter === activeFilter}
      href={{
        query: {
          [name.filter]: filter,
        },
      }}
      onClick={onClick}
    >
      {filter.toUpperCase()}
    </Link>
  ));
};

const read = (todos: TodoState["todos"], activeFilter: TodoState["activeFilter"]) => {
  const result = { filtered: [] as TodoState["todos"], activeCount: 0 };
  for (const todo of todos) {
    if (
      activeFilter === filter.all ||
      (activeFilter === filter.active && !todo.completed) ||
      (activeFilter === filter.completed && todo.completed)
    ) {
      result.filtered.push(todo);
    }
    result.activeCount += Number(!todo.completed);
  }
  return result;
};

export type TodoActionResult = {
  message: string;
} | null;

interface TodosProps {
  todos: TodoState["todos"];
}

export default function Todos({ todos }: TodosProps) {
  const [actionResult, action, pending] = useActionState(todoAction, null);
  const activeFilter = (useSearchParams().get(name.filter) ??
    filter.all) as TodoState["activeFilter"];
  console.log("Todos", { actionResult, todos, activeFilter });

  const { filtered, activeCount } = read(todos, activeFilter);
  return (
    <main className="todo-list">
      <nav className="todo-list-nav">
        <span>{activeCount} active left</span>
        <FilterLinks activeFilter={activeFilter} />
        <span data-pending={pending} className="spinner" aria-label="spinner"></span>
      </nav>
      <form action={action}>
        <input aria-label="create todo" name={name.data} />
        <input hidden name={name.intent} value={intent.create} type="submit" />
      </form>
      <div data-error={Boolean(actionResult?.message)}>
        {actionResult?.message}
      </div>
      <ul>
        {filtered.map((todo) => (
          <TodoListItem todo={todo} action={action} key={todo.id} />
        ))}
      </ul>
    </main>
  );
}

interface TodoListItemProps {
  todo: TodoState["todos"][number];
  action: (formData: FormData) => void;
}

interface StatusUpdaterProps {
  todo: TodoState["todos"][number];
}

interface DeleterProps {
  id: string;
}

interface TextUpdaterProps {
  todo: TodoState["todos"][number];
}

function TodoListItem({ todo, action }: TodoListItemProps) {
  return (
    <li className="todo-list-item">
      <form action={action}>
        <StatusUpdater todo={todo} />
      </form>
      <form action={action}>
        <span>{todo.text}</span>
        <TextUpdater todo={todo} />
      </form>
      <form action={action}>
        <Deleter id={todo.id} />
      </form>
    </li>
  );
}

function StatusUpdater({ todo: { completed, id } }: StatusUpdaterProps) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        data-active={pending}
        data-completed={completed}
        name={name.intent}
        value={intent.statusUpdate}
        aria-label={`${completed ? "uncheck" : "check"} todo`}
        data-check-mark="✓"
      ></button>
      <input hidden readOnly name={name.data} value={String(!completed)} />
      <input hidden readOnly name={name.data} value={id} />
    </>
  );
}

function Deleter({ id }: DeleterProps) {
  const { pending } = useFormStatus();
  return (
    <>
      <button name={name.intent} value={intent.delete} aria-label="delete todo" disabled={pending}>
        X
      </button>
      <input hidden readOnly name={name.data} value={id} />
    </>
  );
}

function TextUpdater({ todo: { text, id } }: TextUpdaterProps) {
  const { pending } = useFormStatus();
  return (
    <details open={pending} className="text-updater">
      <summary data-on-open-prefix="Cancel ">Edit</summary>
      <fieldset disabled={pending}>
        <input aria-label="edit todo" name={name.data} defaultValue={text} />
        <button name={name.intent} value={intent.textUpdate}>
          Save
        </button>
        <input hidden readOnly name={name.data} value={id} />
      </fieldset>
    </details>
  );
}

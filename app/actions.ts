"use server";

import { TodoActionResult } from "@/app/components/Todos";
import { intent, name } from "./constants";
import { db } from "@/lib/db";
import { TodosTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { RowList } from "postgres";
import { revalidatePath } from "next/cache";

const actions = {
  async statusUpdate(data) {
    const [status, id] = data;
    return await db
      .update(TodosTable)
      .set({ completed: JSON.parse(status) })
      .where(and(eq(TodosTable.id, id), eq(TodosTable.userId, 3)));
  },
  async textUpdate(data) {
    const [text, id] = data;
    return await db
      .update(TodosTable)
      .set({ text })
      .where(and(eq(TodosTable.id, id), eq(TodosTable.userId, 3)));
  },
  async delete(data) {
    const [id] = data;
    return await db
      .delete(TodosTable)
      .where(and(eq(TodosTable.id, id), eq(TodosTable.userId, 3)));
  },
  async create(data) {
    const [text] = data;
    return await db.insert(TodosTable).values({ text, userId: 3 });
  },
} satisfies Record<
  Exclude<keyof typeof intent, "filter">,
  (data: string[]) => Promise<RowList<never[]>>
>;

export const todoAction = async (
  _: TodoActionResult,
  formData: FormData
): Promise<TodoActionResult> => {
  console.log("todoAction", { formData });
  const intent = formData.get(name.intent) as keyof typeof actions;
  const data = formData.getAll(name.data) as string[];
  await actions[intent](data);
  // This will only trigger a re-render of components that depend on the todo data
  // Only the changed JSX will be streamed to the client
  revalidatePath("/");
  return {
    success: true,
  };
};

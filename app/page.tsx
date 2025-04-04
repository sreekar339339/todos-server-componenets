import Todos from "@/app/components/Todos";
import { db } from "@/lib/db";
import { TodosTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const todos = await db
    .select({
      id: TodosTable.id,
      text: TodosTable.text,
      completed: TodosTable.completed,
    })
    .from(TodosTable)
    .where(eq(TodosTable.userId, 3))
    .orderBy(TodosTable.createdAt);

  console.log("Home Page rendering", { todos });
  return <Todos todos={todos} />;
}

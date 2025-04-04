import Todos, { TodoState } from "@/app/components/Todos";
import { db } from "@/lib/db";
import { TodosTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { filter } from "./constants";


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // const params = (await searchParams) as {filter?: TodoState['activeFilter']}
  const todos = await db
    .select({
      id: TodosTable.id,
      text: TodosTable.text,
      completed: TodosTable.completed,
    })
    .from(TodosTable)
    .where(eq(TodosTable.userId, 3))
    .orderBy(TodosTable.createdAt)

  console.log("Home Page rendering", {todos})
  return <Todos todos={todos} />;
}

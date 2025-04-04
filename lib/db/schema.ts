import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export const UsersTable = pgTable(
  'profiles',
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (users) => [
    uniqueIndex("email_idx").on(users.email)
  ]
)

export const TodosTable = pgTable(
  'todos',
  {
    id: uuid().defaultRandom().primaryKey(),
    text: text().notNull(),
    completed: boolean().notNull().default(false),
    userId: serial().references(() => UsersTable.id),
    createdAt: timestamp().defaultNow().notNull(),
  }
)

export type UserRecord = InferSelectModel<typeof UsersTable>
export type TodoRecord = InferSelectModel<typeof TodosTable>

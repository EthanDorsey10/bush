import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const todos = sqliteTable('todos', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  title: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const subscribers = sqliteTable('subscribers', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  email: text().notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  ticker: text('ticker').notNull(),
  companyName: text('company_name').notNull(),
  price: real('price').notNull(),
  priceChange: real('price_change').notNull(),
  summary: text('summary').notNull(),
  sentiment: text('sentiment').notNull(),
  keyRisks: text('key_risks', { mode: 'json' }).notNull().$type<string[]>(),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).notNull(),
});

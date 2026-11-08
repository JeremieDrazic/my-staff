import { db } from './db'

export async function listOrders(customerId: string) {
  return db.query('SELECT * FROM orders WHERE customer_id = $1', [customerId])
}

export function formatTotal(cents: number) {
  return `${(cents / 100).toFixed(2)} €`
}

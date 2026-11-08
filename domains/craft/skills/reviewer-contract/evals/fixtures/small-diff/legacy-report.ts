// Pre-existing, untouched by this change: builds a report with string concatenation.
export function reportQuery(month: string) {
  return "SELECT * FROM orders WHERE month = '" + month + "'"
}

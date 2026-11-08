import { useEffect, useState } from 'react'

export function OrderList({ customerId }: { customerId: string }) {
  const [orders, setOrders] = useState<unknown[]>([])
  useEffect(() => {
    fetch(`/api/orders/${customerId}`).then((r) => r.json()).then(setOrders)
  }, [customerId])
  return <ul>{orders.map((o, i) => <li key={i}>{String(o)}</li>)}</ul>
}

import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { z } from 'zod'

const orderSchema = z.object({ symbol: z.string().min(1).max(12), side: z.enum(['buy', 'sell']), quantity: z.number().positive().finite(), price: z.number().positive().finite(), stopLoss: z.number().positive().finite().optional(), takeProfit: z.number().positive().finite().optional() })
const demoUser = '00000000-0000-0000-0000-000000000001'

export async function GET() {
  const account = await db.execute(sql`SELECT id, balance, currency FROM trading_accounts WHERE user_id = ${demoUser} LIMIT 1`)
  if (!account.rows[0]) await db.execute(sql`INSERT INTO trading_accounts (user_id, balance) VALUES (${demoUser}, 100000)`)
  const [fresh, positions, orders] = await Promise.all([
    db.execute(sql`SELECT id, balance, currency FROM trading_accounts WHERE user_id = ${demoUser} LIMIT 1`),
    db.execute(sql`SELECT symbol, quantity, average_price FROM trading_positions WHERE user_id = ${demoUser} ORDER BY symbol`),
    db.execute(sql`SELECT id, symbol, side, quantity, entry_price, status, created_at FROM trading_orders WHERE user_id = ${demoUser} ORDER BY created_at DESC LIMIT 20`),
  ])
  return NextResponse.json({ account: fresh.rows[0], positions: positions.rows, orders: orders.rows })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid order parameters' }, { status: 400 })
  const { symbol, side, quantity, price, stopLoss, takeProfit } = parsed.data
  const cost = quantity * price
  const result = await db.transaction(async (tx) => {
    const account = await tx.execute(sql`SELECT id, balance FROM trading_accounts WHERE user_id = ${demoUser} FOR UPDATE`)
    if (!account.rows[0]) await tx.execute(sql`INSERT INTO trading_accounts (user_id, balance) VALUES (${demoUser}, 100000)`)
    const current = await tx.execute(sql`SELECT id, balance FROM trading_accounts WHERE user_id = ${demoUser} FOR UPDATE`)
    const balance = Number(current.rows[0].balance)
    if (side === 'buy' && balance < cost) throw new Error('Insufficient buying power')
    const existing = await tx.execute(sql`SELECT quantity, average_price FROM trading_positions WHERE user_id = ${demoUser} AND symbol = ${symbol} FOR UPDATE`)
    const oldQty = Number(existing.rows[0]?.quantity ?? 0)
    const oldAvg = Number(existing.rows[0]?.average_price ?? 0)
    const nextQty = side === 'buy' ? oldQty + quantity : oldQty - quantity
    if (side === 'sell' && oldQty < quantity) throw new Error('Insufficient position quantity')
    const realized = side === 'sell' ? (price - oldAvg) * quantity : 0
    const nextBalance = balance + (side === 'sell' ? cost : -cost) + realized
    await tx.execute(sql`UPDATE trading_accounts SET balance = ${nextBalance}, updated_at = now() WHERE user_id = ${demoUser}`)
    if (nextQty === 0) await tx.execute(sql`DELETE FROM trading_positions WHERE user_id = ${demoUser} AND symbol = ${symbol}`)
    else await tx.execute(sql`INSERT INTO trading_positions (user_id, account_id, symbol, quantity, average_price) VALUES (${demoUser}, ${current.rows[0].id}, ${symbol}, ${nextQty}, ${side === 'buy' ? (oldQty * oldAvg + cost) / nextQty : oldAvg}) ON CONFLICT (user_id, symbol) DO UPDATE SET quantity = EXCLUDED.quantity, average_price = EXCLUDED.average_price, updated_at = now()`)
    const order = await tx.execute(sql`INSERT INTO trading_orders (user_id, account_id, symbol, side, quantity, entry_price, stop_loss, take_profit, realized_pnl) VALUES (${demoUser}, ${current.rows[0].id}, ${symbol}, ${side}, ${quantity}, ${price}, ${stopLoss ?? null}, ${takeProfit ?? null}, ${realized}) RETURNING id, symbol, side, quantity, entry_price, status`)
    return { balance: nextBalance, order: order.rows[0] }
  })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Trading service error'
    const knownError = ['Insufficient buying power', 'Insufficient position quantity'].includes(message)
    return NextResponse.json({ error: knownError ? message : 'Unable to process order' }, { status: knownError ? 400 : 500 })
  }
}

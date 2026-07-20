import { pool } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const { rows } = await pool.query("SELECT count FROM page_views WHERE id = 1")
  const count = rows[0]?.count ?? 0
  return Response.json({ count: Number(count) })
}

export async function POST() {
  const { rows } = await pool.query(
    "UPDATE page_views SET count = count + 1 WHERE id = 1 RETURNING count",
  )
  const count = rows[0]?.count ?? 0
  return Response.json({ count: Number(count) })
}

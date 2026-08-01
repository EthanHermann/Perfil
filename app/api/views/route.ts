import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

// A contagem NUNCA fica abaixo deste valor. O site "começa" em 1227 e cada
// novo acesso soma +1 a partir daí. Usamos GREATEST no banco para garantir o
// piso mesmo que o valor armazenado esteja abaixo (ex.: acessos de teste).
const BASE_VIEWS = 1227

export async function GET() {
  const { rows } = await query("SELECT count FROM page_views WHERE id = 1")
  const count = Math.max(Number(rows[0]?.count ?? 0), BASE_VIEWS)
  return Response.json({ count })
}

export async function POST() {
  // GREATEST(count, BASE_VIEWS) eleva o valor ao piso antes de incrementar,
  // então o primeiro acesso real já exibe 1228 (1227 + 1) e assim por diante.
  const { rows } = await query(
    "UPDATE page_views SET count = GREATEST(count, $1) + 1 WHERE id = 1 RETURNING count",
    [BASE_VIEWS],
  )
  const count = Math.max(Number(rows[0]?.count ?? 0), BASE_VIEWS + 1)
  return Response.json({ count })
}

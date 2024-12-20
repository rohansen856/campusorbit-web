import { db } from "@/lib/db"

export async function GET() {
  try {
    const institutes = await db.institute.findMany({
      select: {
        id: true,
        name: true,
        short_name: true,
        affiliation: true,
        logo_url: true,
        website_url: true,
      },
    })

    return new Response(JSON.stringify(institutes), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch institutes" }),
      { status: 500 }
    )
  }
}

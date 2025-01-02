import { db } from "@/lib/db"
import { MerchDetails } from "@/components/merch/merch-details"

export default async function MerchPage({
  params,
}: {
  params: { id: number }
}) {
  const merch = await db.merch.findUnique({
    where: { id: Number(params.id) },
  })
  return <MerchDetails id={params.id} />
}

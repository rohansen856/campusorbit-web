import { MerchDetails } from "@/components/merch/merch-details"

export default function MerchPage({ params }: { params: { id: string } }) {
  return <MerchDetails id={params.id} />
}

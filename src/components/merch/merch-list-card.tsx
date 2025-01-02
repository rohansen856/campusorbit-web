import Image from "next/image"
import Link from "next/link"
import { Merch } from "@prisma/client"
import { format } from "date-fns"
import { motion } from "framer-motion"

import { MerchCardType } from "@/lib/validation"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MerchCardProps {
  merch: MerchCardType
}

export default function MerchCard({ merch }: MerchCardProps) {
  return (
    <Link href={`/merch/${merch.id}`} className="block">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Card className="p-0">
          <CardHeader>
            <div className="bg-secondary relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={
                  "https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                } //{merch.thumbnailImage}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle>{merch.name}</CardTitle>
            <p className="text-2xl font-bold">₹{Number(merch.price)}</p>
            <p>{merch.club.name}</p>
            <p>{merch.club.institute.short_name}</p>
            {merch.club.clubType === "sports" && (
              <p className="text-sm text-blue-500">Sports Merch</p>
            )}
            {merch.club.clubType === "technical" && (
              <p className="text-sm text-green-500">Technical Merch</p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Available from:{" "}
              {merch.availabilityDate
                ? format(merch.availabilityDate, "PPP")
                : "undecided"}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}

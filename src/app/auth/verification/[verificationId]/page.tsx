import Link from "next/link"

import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function Page({
  params,
}: {
  params: { verificationId: string }
}) {
  const verification = await db.studentVerification.findFirst({
    where: { id: params.verificationId },
  })
  if (!verification) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <p className="rounded-xl border border-red-500 bg-red-500/30 p-6">
          Invalid Verification ID
        </p>
      </div>
    )
  }
  await db.student.updateMany({
    where: { StudentVerification: { some: { id: verification.id } } },
    data: { verified: true },
  })
  return (
    <div className="flex h-[40vh] flex-col items-center justify-center">
      <p className="mb-2 rounded-xl border border-green-500 bg-green-500/30 p-6">
        Verification done! enjoy!
      </p>
      <Link href={"/dashboard"} className={cn(buttonVariants())}>
        Go to dashboard
      </Link>
    </div>
  )
}

import { NextResponse } from "next/server"
import { Merch } from "@prisma/client"
import { z } from "zod"

import { db } from "@/lib/db"
import { MerchCardType, merchSchema } from "@/lib/validation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get("search")
  const minPrice = Number(searchParams.get("minPrice"))
  const maxPrice = Number(searchParams.get("maxPrice"))
  const college = Number(searchParams.get("college"))
  const club = searchParams.get("club")
  const availabilityDate = searchParams.get("availabilityDate")
    ? new Date(searchParams.get("availabilityDate") || new Date())
    : null
  const sportsMerch = searchParams.get("sportsMerch") === "true"
  const technicalMerch = searchParams.get("technicalMerch") === "true"
  const merchType = searchParams.get("merchType") || "all"

  const currentDate = new Date()

  // const filteredMerch = mockMerch.filter(
  //   (item) =>
  //     item.name.toLowerCase().includes(search.toLowerCase()) &&
  //     item.price >= minPrice &&
  //     item.price <= maxPrice &&
  //     (college === 0 || item.college === college) &&
  //     (club === "" || item.club === club) &&
  //     (!availabilityDate ||
  //       new Date(item.availabilityDate) <= availabilityDate) &&
  //     (!sportsMerch || item.isSportsMerch) &&
  //     (!technicalMerch || item.isTechnicalMerch) &&
  //     (merchType === "all" ||
  //       (merchType === "previous" &&
  //         new Date(item.availabilityDate) < currentDate) ||
  //       (merchType === "upcoming" &&
  //         new Date(item.availabilityDate) >= currentDate))
  // )

  const filteredMerch: MerchCardType[] = await db.merch.findMany({
    where: {
      name: { contains: search || "", mode: "insensitive" },
      price: { gte: minPrice || 0, lte: maxPrice || 999999 },
      availabilityDate: availabilityDate
        ? { lte: availabilityDate }
        : undefined,
      club: {
        name: club || undefined,
        clubType: sportsMerch
          ? "sports"
          : technicalMerch
            ? "technical"
            : undefined,
        institute_id: college || undefined,
      },
    },
    include: {
      club: {
        select: {
          name: true,
          clubType: true,
          institute_id: true,
          institute: { select: { short_name: true } },
        },
      },
    },
  })

  return NextResponse.json([...filteredMerch])
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = merchSchema.parse(body)

    console.log(validatedData)

    const merch = await db.merch.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        thumbnailImage: validatedData.thumbnailImage,
        price: validatedData.price,
        sizes: validatedData.sizes,
        colors: validatedData.colors,
        images: validatedData.images,
        availabilityDate: new Date(),
        clubId: "abc",
      },
    })

    return NextResponse.json(merch, { status: 201 })
  } catch (error) {
    console.error("Failed to create merch:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create merch" },
      { status: 500 }
    )
  }
}

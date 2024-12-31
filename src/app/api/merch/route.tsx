import { NextResponse } from "next/server"
import { Merch } from "@prisma/client"
import { z } from "zod"

import { db } from "@/lib/db"
import { MerchCardType, merchSchema } from "@/lib/validation"

// This is a mock database. Replace with actual database queries in production.
const mockMerch = [
  {
    id: 1,
    name: "T-Shirt",
    price: 20,
    club: "Tech Club",
    college: 166,
    availabilityDate: "2023-07-01",
    isSportsMerch: false,
    isTechnicalMerch: true,
  },
  {
    id: 2,
    name: "Hoodie",
    price: 40,
    club: "Sports Club",
    college: "Harvard",
    availabilityDate: "2023-08-15",
    isSportsMerch: true,
    isTechnicalMerch: false,
  },
  {
    id: 3,
    name: "Cap",
    price: 15,
    club: "Tech Club",
    college: 166,
    availabilityDate: "2023-06-01",
    isSportsMerch: false,
    isTechnicalMerch: true,
  },
  {
    id: 4,
    name: "Jersey",
    price: 50,
    club: "Sports Club",
    college: "Harvard",
    availabilityDate: "2023-09-01",
    isSportsMerch: true,
    isTechnicalMerch: false,
  },
  {
    id: 5,
    name: "Laptop Sticker",
    price: 5,
    club: "Tech Club",
    college: 166,
    availabilityDate: "2023-05-01",
    isSportsMerch: false,
    isTechnicalMerch: true,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get("search") || ""
  const minPrice = Number(searchParams.get("minPrice")) || 0
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity
  const college = Number(searchParams.get("college")) || 0
  const club = searchParams.get("club") || ""
  const availabilityDate = searchParams.get("availabilityDate")
    ? new Date(searchParams.get("availabilityDate")!)
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

"use client"

import { useEffect, useState } from "react"
import { Club } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import { toast } from "sonner"

import { ClubCard } from "@/components/club/club-card"
import { ClubFilters } from "@/components/club/club-filters"

interface ClubListProps extends React.HTMLAttributes<HTMLDivElement> {
  instituteId: number
}

export function ClubList({ instituteId, ...props }: ClubListProps) {
  const [clubs, setClubs] = useState<
    Array<Club & { _count: { members: number } }>
  >([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    clubType: "",
    search: "",
    institute: instituteId,
  })

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true)
        console.log(filters.toString())
        const data = await axios.get(`/api/club`, { params: filters })
        setClubs(data.data)
      } catch (error) {
        console.error("Failed to fetch clubs:", error)
        toast.error("Failed to fetch clubs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchClubs, 700)
    return () => clearTimeout(debounce)
  }, [filters])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <ClubFilters
        clubType={filters.clubType}
        institute={filters.institute}
        search={filters.search}
        onTypeChange={(clubType) =>
          setFilters((prev) => ({ ...prev, clubType }))
        }
        onInstituteChange={(institute) =>
          setFilters((prev) => ({ ...prev, institute }))
        }
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
      />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex justify-center"
          >
            <Loader className="size-6 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex flex-col gap-2"
          >
            {clubs.map((club, index) => (
              <ClubCard key={club.id} club={club} index={index} />
            ))}

            {clubs.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-muted-foreground"
              >
                No clubs found matching your criteria.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

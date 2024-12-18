"use client"

import { useEffect, useState } from "react"
import { Club } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import { toast } from "sonner"

import { ClubCard } from "@/components/club/club-card"
import { ClubFilters } from "@/components/club/club-filters"

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: "cultural", // Default filter
    search: "",
  })

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true)
        const data = await axios.get(`/api/clubs?${filters.toString()}`)
        setClubs(data.data)
      } catch (error) {
        console.error("Failed to fetch clubs:", error)
        toast.error("Failed to fetch clubs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchClubs, 300)
    return () => clearTimeout(debounce)
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <ClubFilters
          type={filters.type}
          search={filters.search}
          onTypeChange={(type) => setFilters((prev) => ({ ...prev, type }))}
          onSearchChange={(search) =>
            setFilters((prev) => ({ ...prev, search }))
          }
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Loader />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
    </div>
  )
}

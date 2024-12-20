"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Institute, Student, User } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import { toast } from "sonner"

import { UserFilters } from "@/components/user/user-filters"
import { UserListItem } from "@/components/user/user-list-item"

export default function UsersPage() {
  const [users, setUsers] = useState<
    (Student & { institute: Institute } & { user: User })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    semester: "",
    instituteId: "",
  })

  const getUsers = async (params: {
    search?: string
    page?: number
    branch?: string
    semester?: string
    instituteId?: string
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await axios.get(`/api/users?${searchParams.toString()}`)
    return response.data
  }

  const observer = useRef<IntersectionObserver>()
  const lastUserElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers({ ...filters, page })
        setUsers((prev) => (page === 1 ? data.users : [...prev, ...data.users]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast.error("Failed to fetch users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchUsers, 700)
    return () => clearTimeout(debounce)
  }, [filters, page])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <UserFilters onFilterChange={handleFilterChange} />

          <div className="mt-8 space-y-4">
            <AnimatePresence mode="wait">
              {loading && page === 1 ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-8"
                >
                  <Loader className="size-6 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {users.map((user, index) => (
                    <div
                      key={user.user_id}
                      ref={
                        index === users.length - 1 ? lastUserElementRef : null
                      }
                    >
                      <UserListItem user={user} index={index} />
                    </div>
                  ))}

                  {loading && hasMore && (
                    <div className="flex justify-center py-8">
                      <Loader className="size-6 animate-spin" />
                    </div>
                  )}

                  {!loading && users.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground"
                    >
                      No users found matching your criteria.
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

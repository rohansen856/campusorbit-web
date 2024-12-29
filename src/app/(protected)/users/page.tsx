"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader, X } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  ExtendedStudent,
  UserDetails,
  UserFiltersType,
  UserResponse,
  UsersResponse,
} from "@/components/user/user-details-card"
import { UserFilters } from "@/components/user/user-filters"
import { UserListItem } from "@/components/user/user-list-item"

export default function UsersPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")

  const [users, setUsers] = useState<ExtendedStudent[]>([])
  const [selectedUser, setSelectedUser] = useState<ExtendedStudent | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingUser, setLoadingUser] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [showMobileAlert, setShowMobileAlert] = useState(false)
  const [filters, setFilters] = useState<UserFiltersType>({
    search: "",
    branch: "",
    semester: "",
    instituteId: "",
  })

  const getUsers = async (
    params: UserFiltersType & { page?: number }
  ): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await axios.get<UsersResponse>(
      `/api/users?${searchParams.toString()}`
    )
    return response.data
  }

  const getUser = async (id: string): Promise<UserResponse> => {
    const response = await axios.get<UserResponse>(`/api/users/${id}`)
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

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return

      try {
        setLoadingUser(true)
        const data = await getUser(userId)
        setSelectedUser(data.user)
        setShowMobileAlert(true)
      } catch (error) {
        console.error("Failed to fetch user:", error)
        toast.error("Failed to fetch user details. Please try again later.")
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUser()
  }, [userId])

  const handleFilterChange = (newFilters: UserFiltersType) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Desktop view */}
          <div className="col-span-2 hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {userId && (
                <UserDetails user={selectedUser} loading={loadingUser} />
              )}
            </motion.div>
          </div>

          {/* Mobile popup */}
          <AnimatePresence>
            {userId && showMobileAlert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-background/50 fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden"
              >
                <Alert className="bg-background relative max-h-[90vh] w-full max-w-lg overflow-y-auto">
                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => setShowMobileAlert(false)}
                    className="hover:bg-secondary border-primary/50 absolute right-4 top-4 rounded-full border p-2"
                  >
                    <X className="size-4" />
                  </Button>
                  <AlertDescription className="pt-2">
                    <UserDetails user={selectedUser} loading={loadingUser} />
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl md:col-span-3"
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
                    className="space-y-2"
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
                        className="text-muted-foreground text-center"
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
    </div>
  )
}

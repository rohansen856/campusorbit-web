"use client"

import { useCallback, useEffect, useState } from "react"
import { Club, Institute } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronsUpDown, FilterIcon, Loader } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import MerchCard from "@/components/merch/merch-list-card"

import { DualRangeSlider } from "../ui/dual-range-slider"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export default function MerchListing() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000])
  const [selectedCollege, setSelectedCollege] = useState<number>()
  const [selectedClub, setSelectedClub] = useState("")
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(
    undefined
  )
  const [sportsMerch, setSportsMerch] = useState(false)
  const [technicalMerch, setTechnicalMerch] = useState(false)
  const [merchType, setMerchType] = useState("all")
  const [merch, setMerch] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [institutes, setInstitutes] = useState<
    { id: number; name: string; short_name: string }[]
  >([])

  useEffect(() => {
    axios
      .get("/api/institutes")
      .then((response: AxiosResponse<Institute[]>) => {
        setInstitutes(response.data.toSorted())
      })
  }, [])

  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    axios.get("/api/club").then((response: AxiosResponse<Club[]>) => {
      setClubs(response.data.toSorted())
    })
  }, [])

  const fetchMerch = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/merch", {
        params: {
          search: searchTerm,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          college: selectedCollege,
          club: selectedClub,
          availabilityDate: availabilityDate?.toISOString(),
          sportsMerch,
          technicalMerch,
          merchType,
        },
      })
      setMerch(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Error fetching merch:", error)
      setMerch([])
    } finally {
      setIsLoading(false)
    }
  }, [
    searchTerm,
    priceRange,
    selectedCollege,
    selectedClub,
    availabilityDate,
    sportsMerch,
    technicalMerch,
    merchType,
  ])

  useEffect(() => {
    const debounce = setTimeout(fetchMerch, 700)
    return () => clearTimeout(debounce)
  }, [fetchMerch])

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <DualRangeSlider
          label={(val) => <span>₹{val}</span>}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          min={0}
          max={10_000}
          step={1}
        />
        <div className="flex w-full items-center justify-between">
          <Input
            className="w-24"
            type="number"
            min={0}
            max={10_000}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value || 0), priceRange[1]])
            }
          />
          <h3 className="text-sm font-medium">Price Range</h3>
          <Input
            className="w-24"
            type="number"
            min={0}
            max={10_000}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value || 0)])
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">College</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between overflow-hidden",
                !selectedCollege && "text-muted-foreground"
              )}
            >
              {selectedCollege
                ? institutes.find(
                    (institute) => institute.id === selectedCollege
                  )?.short_name
                : "Select college"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-lg p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No institute found.</CommandEmpty>
                <CommandGroup>
                  {institutes.map((institute) => (
                    <CommandItem
                      value={institute.name}
                      key={institute.id}
                      onSelect={() => {
                        setSelectedCollege(institute.id)
                      }}
                    >
                      {institute.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          institute.id === selectedCollege
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Club</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between overflow-hidden",
                !selectedClub && "text-muted-foreground"
              )}
            >
              {selectedClub
                ? clubs.find((club) => club.id === selectedClub)?.name
                : "Select Club"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-lg p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No club found.</CommandEmpty>
                <CommandGroup>
                  {clubs.map((club) => (
                    <CommandItem
                      value={club.name}
                      key={club.id}
                      onSelect={() => {
                        setSelectedClub(club.id)
                      }}
                    >
                      {club.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          club.id === selectedClub ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Available By</h3>
        <DatePicker
          selected={availabilityDate}
          onSelect={setAvailabilityDate}
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Merch Type</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sportsMerch"
            checked={sportsMerch}
            onCheckedChange={(state) =>
              setSportsMerch(state.valueOf() as boolean)
            }
          />
          <label htmlFor="sportsMerch">Sports Merch</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="technicalMerch"
            checked={technicalMerch}
            onCheckedChange={(state) =>
              setTechnicalMerch(state.valueOf() as boolean)
            }
          />
          <label htmlFor="technicalMerch">Technical Merch</label>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Availability</h3>
        <Select onValueChange={setMerchType}>
          <SelectTrigger>
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Merch</SelectItem>
            <SelectItem value="previous">Previous Merch</SelectItem>
            <SelectItem value="upcoming">Upcoming Merch</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="hidden w-full md:block md:w-1/4">
        <FilterContent />
      </div>
      <div className="mb-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <FilterIcon className="mr-2 size-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Adjust filters to find the perfect merch
              </SheetDescription>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-full md:w-3/4">
        <Input
          type="search"
          placeholder="Search merch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <AnimatePresence>
          {isLoading ? (
            <div className="flex w-full text-center">
              <Loader className={`mx-auto size-4 animate-spin`} />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {merch.map((item) => (
                <MerchCard key={item.id} merch={item} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

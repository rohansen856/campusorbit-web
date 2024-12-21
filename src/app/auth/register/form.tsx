"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Institute } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { motion } from "framer-motion"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
import { useForm } from "react-hook-form"

import { branches } from "@/lib/data"
import { cn } from "@/lib/utils"
import { StudentFormData, studentSchema } from "@/lib/validation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StudentRegistrationForm() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [institutes, setInstitutes] = useState<{ id: number; name: string }[]>(
    []
  )
  const { toast } = useToast()
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      semester: 1,
      enrollment_year: new Date().getFullYear(),
    },
  })

  useEffect(() => {
    axios
      .get("/api/institutes")
      .then((response: AxiosResponse<Institute[]>) => {
        setInstitutes(response.data.toSorted())
      })
  }, [])

  async function onSubmit(data: StudentFormData) {
    setLoading(true)
    try {
      const res = await axios.post("/api/auth/student", data)
      if (res.status !== 201) {
        toast({
          title: "Registration Failed",
          description:
            "There was an error registering the student. Please try again.",
          variant: "destructive",
        })
      }
      toast({
        title: "Registration Successful",
        description: "Your student profile has been created.",
      })
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          "There was an error registering the student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        Complete Student Registration
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-4 grid grid-cols-1 md:grid-cols-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a unique usename" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roll_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter roll number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toLowerCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    {...field}
                    value={field.value ?? new Date().getFullYear()}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enrollment_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enrollment Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2000}
                    max={new Date().getFullYear()}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="graduation_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2000}
                    {...field}
                    value={field.value ?? new Date().getFullYear()}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Branch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.key} value={branch.key}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your branch from available options
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Your Group (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your group"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormDescription>ex.: A, B, C...</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="institute_id"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2">
                <FormLabel>Institute</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full overflow-hidden justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? institutes.find(
                              (institute) => institute.id === field.value
                            )?.name
                          : "Select institute"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-lg w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No institute found.</CommandEmpty>
                        <CommandGroup>
                          {institutes.map((institute) => (
                            <CommandItem
                              value={institute.name}
                              key={institute.id}
                              onSelect={() => {
                                form.setValue("institute_id", institute.id)
                              }}
                            >
                              {institute.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  institute.id === field.value
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
                <FormDescription>
                  Choose your college among the available IIT, NIT, IIITs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full col-span-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="size-6 animate-spin" />
            ) : (
              "Register Student"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}

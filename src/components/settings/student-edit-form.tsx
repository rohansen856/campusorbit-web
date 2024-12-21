"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Student } from "@prisma/client"
import axios from "axios"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { branches, groups, semesters } from "@/lib/data"
import { StudentFormData, studentSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudentEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student
}

export default function StudentEditForm({
  student,
  ...props
}: StudentEditFormProps) {
  const [institutes, setInstitutes] = useState<{ id: number; name: string }[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isFormEdited, setIsFormEdited] = useState(false)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      username: student.username,
      semester: student.semester,
      roll_number: student.roll_number,
      enrollment_year: student.enrollment_year,
      graduation_year: student.graduation_year,
      branch: student.branch,
      group: student.group,
      institute_id: student.institute_id,
    },
  })

  useEffect(() => {
    axios.get("/api/institutes").then((response) => {
      setInstitutes(response.data.toSorted())
    })
  }, [])

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true)
    try {
      await axios.patch("/api/auth/student", data)
      toast.success("Successfully updated your information")
    } catch (error) {
      toast.error("Failed to update your information")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        const isChanged = Object.keys(value).some(
          (key) =>
            value[key as keyof StudentFormData] !==
            student[key as keyof StudentFormData]
        )
        setIsFormEdited(isChanged)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, student])

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader>
        <CardTitle>Edit Student Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
              name="branch"
              render={({ field }) => (
                <FormItem>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institute_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institute</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an institute" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {institutes.map((institute) => (
                        <SelectItem
                          key={institute.id}
                          value={institute.id.toString()}
                        >
                          {institute.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormEdited}
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

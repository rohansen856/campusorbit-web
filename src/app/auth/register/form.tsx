"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { motion } from "framer-motion"
import { StudentFormData, studentSchema } from "@/lib/validation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const branches = [
    "CSE",
    "ECE",
    "EEE",
    "ME",
    "CE",
    "IT",
    "DS",
    "AI",
    "CS",
    "CH",
    "BT",
]

export function StudentRegistrationForm() {
    const [institutes, setInstitutes] = useState<
        { id: number; name: string }[]
    >([])
    const { toast } = useToast()
    const form = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            semester: 1,
            enrollment_year: new Date().getFullYear(),
        },
    })

    useEffect(() => {
        // axios.get("/api/institutes").then((response) => {
        //     setInstitutes(response.data)
        // })
    }, [])

    async function onSubmit(data: StudentFormData) {
        try {
            const response = await axios.post("/api/register-student", data)
            toast({
                title: "Registration Successful",
                description: "Your student profile has been created.",
            })
            form.reset()
        } catch (error) {
            toast({
                title: "Registration Failed",
                description:
                    "There was an error registering the student. Please try again.",
                variant: "destructive",
            })
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
                        name="user_id"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>User ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter user ID"
                                        {...field}
                                    />
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
                                        value={
                                            field.value ??
                                            new Date().getFullYear()
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profile_image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter profile image URL"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="background_banner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Banner URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter background banner URL"
                                        {...field}
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
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }
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
                                        value={
                                            field.value ??
                                            new Date().getFullYear()
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }
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
                                            <SelectItem
                                                key={branch}
                                                value={branch}
                                            >
                                                {branch}
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
                                    onValueChange={(value) =>
                                        field.onChange(parseInt(value))
                                    }
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your institute" />
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
                    <Button type="submit" className="w-full col-span-2">
                        Register Student
                    </Button>
                </form>
            </Form>
        </motion.div>
    )
}

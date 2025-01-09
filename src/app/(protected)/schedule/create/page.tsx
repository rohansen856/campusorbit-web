"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { BatchImport } from "@/components/schedule/create/BatchImport"
import { ScheduleForm } from "@/components/schedule/create/ScheduleForm"

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Schedule Management</h1>
      <Tabs defaultValue="form">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="form">Manual Entry</TabsTrigger>
          <TabsTrigger value="import">Batch Import</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <ScheduleForm />
        </TabsContent>
        <TabsContent value="import">
          <BatchImport />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

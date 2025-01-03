"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BatchImport } from "@/components/schedule/BatchImport"
import { ScheduleForm } from "@/components/schedule/ScheduleForm"

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Schedule Management</h1>
      <Tabs defaultValue="form">
        <TabsList className="grid w-full grid-cols-2 mb-8">
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
    </div>
  )
}

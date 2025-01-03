"use client"

import { useState } from "react"
import { Schedule } from "@prisma/client"
import axios from "axios"
import { FileJson, FileSpreadsheet, Upload } from "lucide-react"

import { downloadData } from "@/lib/download-schedule"
import { parseCSV, parseJSON } from "@/lib/schedule-parser"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTable } from "./DataTable"
import { DefaultValues } from "./DefaultValues"

export function BatchImport() {
  const [data, setData] = useState<Schedule[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<Schedule>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fileContent = await file.text()
      const parsedData = file.name.endsWith(".csv")
        ? parseCSV(fileContent)
        : parseJSON(fileContent)

      setData(parsedData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to parse file",
      })
    }
  }

  const handleDefaultValueChange = (field: keyof Schedule, value: any) => {
    setDefaultValues((prev) => ({ ...prev, [field]: value }))
    setData((prev) => prev.map((item) => ({ ...item, [field]: value })))
  }

  const handleDownload = (format: "csv" | "json") => {
    downloadData(data, format)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleDownload("csv")}
            disabled={!data.length}
          >
            <FileSpreadsheet className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownload("json")}
            disabled={!data.length}
          >
            <FileJson className="mr-2 size-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <>
          <DefaultValues
            defaultValues={defaultValues}
            onChange={handleDefaultValueChange}
          />
          <div className="overflow-x-auto">
            <DataTable
              data={data}
              isLoading={isLoading}
              onInsert={async (rows) => {
                setIsLoading(true)
                try {
                  // Insert in batches of 10
                  for (let i = 0; i < rows.length; i += 10) {
                    const batch = rows.slice(i, i + 10)
                    await axios.post("/api/schedule/batch", {
                      schedules: batch,
                    })
                  }
                  toast({
                    title: "Success",
                    description: "Schedules created successfully",
                  })
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create schedules",
                  })
                } finally {
                  setIsLoading(false)
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

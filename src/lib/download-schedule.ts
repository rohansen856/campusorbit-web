export function downloadData(data: any[], format: "csv" | "json") {
  let content: string
  let type: string
  let extension: string

  if (format === "csv") {
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n")
    content = csvContent
    type = "text/csv"
    extension = "csv"
  } else {
    content = JSON.stringify(data, null, 2)
    type = "application/json"
    extension = "json"
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `schedule.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

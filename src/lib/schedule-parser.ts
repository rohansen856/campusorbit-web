export function parseCSV(content: string): any[] {
  const lines = content.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index]
      return obj
    }, {} as any)
  })
}

export function parseJSON(content: string): any[] {
  return JSON.parse(content)
}

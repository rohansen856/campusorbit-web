import { AttendanceRecord, TransformedAttendanceRecord } from "@/types"

export function getGroupedAttendance(
  records: AttendanceRecord[]
): TransformedAttendanceRecord[] {
  const groupedByDate: Record<
    string,
    { id: string; course_code: string; status: string }[]
  > = {}

  records.forEach((record) => {
    const { id, attendanceDate, status, schedule } = record
    const date = new Date(attendanceDate).toISOString()

    if (!groupedByDate[date]) {
      groupedByDate[date] = []
    }

    groupedByDate[date].push({
      id: record.id,
      course_code: schedule.course_code,
      status: status,
    })
  })

  return Object.entries(groupedByDate)
    .map(([date, details]) => ({
      id: date, // Using the date as the id since we need an id field
      date: date,
      details: details,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
}

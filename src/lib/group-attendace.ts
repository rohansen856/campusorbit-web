import { AttendanceRecord, TransformedAttendanceRecord } from "@/types"

export function getGroupedAttendance(
  records: AttendanceRecord[]
): TransformedAttendanceRecord[] {
  const groupedByDate: Record<
    string,
    { course_code: string; status: string }[]
  > = {}

  records.forEach((record) => {
    const { attendanceDate, status, schedule } = record
    const date = new Date(attendanceDate).toISOString()

    if (!groupedByDate[date]) {
      groupedByDate[date] = []
    }

    groupedByDate[date].push({
      course_code: schedule.course_code,
      status: status,
    })
  })

  return Object.entries(groupedByDate)
    .map(([date, details]) => ({
      date,
      details,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
}

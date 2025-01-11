export type AttendanceRecord = {
  id: string
  attendanceDate: Date
  status: string
  schedule: { course_code: string }
}

export type TransformedAttendanceRecord = {
  date: string
  details: { id: string; course_code: string; status: string }[]
}

export type SpecialDate = {
  date: Date
  event: string
  type: "holiday" | "half day" | "none"
}

import { db } from "@/lib/db"

export default async function TestPage() {
  await db.attendance.createMany({
    data: [
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_1_018",
        attendanceDate: new Date("2024-12-25 12:30:00"),
        status: "PRESENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_1_019",
        attendanceDate: new Date("2024-12-25 12:30:00"),
        status: "ABSENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_1_020",
        attendanceDate: new Date("2024-12-26 12:30:00"),
        status: "EXCUSED",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_0_4_1_023",
        attendanceDate: new Date("2024-12-26 12:30:00"),
        status: "PRESENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_1_058",
        attendanceDate: new Date("2024-12-26 12:30:00"),
        status: "ABSENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_1_059",
        attendanceDate: new Date("2024-12-26 12:30:00"),
        status: "EXCUSED",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_1_060",
        attendanceDate: new Date("2024-12-26 12:30:00"),
        status: "PRESENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_0_4_1_063",
        attendanceDate: new Date("2024-12-27 12:30:00"),
        status: "ABSENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_2_033",
        attendanceDate: new Date("2024-12-28 12:30:00"),
        status: "EXCUSED",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_2_034",
        attendanceDate: new Date("2024-12-29 12:30:00"),
        status: "PRESENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_2_035",
        attendanceDate: new Date("2024-12-30 12:30:00"),
        status: "ABSENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_0_4_1_038",
        attendanceDate: new Date("2024-12-31 12:30:00"),
        status: "EXCUSED",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_lab_050",
        attendanceDate: new Date("2024-1-5 12:30:00"),
        status: "PRESENT",
      },
      {
        studentId: "cm4ub6ng600005zjkxnggpunn",
        scheduleId: "iiitdmj_cse_Z_4_lab_051",
        attendanceDate: new Date("2024-1-5 12:30:00"),
        status: "ABSENT",
      },
    ],
  })
  return ""
}

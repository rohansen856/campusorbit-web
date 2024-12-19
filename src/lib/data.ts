import { Activity, Book, Code, Music, Palette, Users } from "lucide-react"

export const branches = [
  { key: "CSE", label: "Computer Science and Engineering" },
  { key: "ECE", label: "Electronics and Communication Engineering" },
  { key: "SM", label: "Smart Manufacturing" },
  { key: "ME", label: "Mechanical Engineering" },
  { key: "DS", label: "Design" },
  { key: "EEE", label: "Electrical and Electronics Engineering" },
  { key: "CE", label: "Civil Engineering" },
  { key: "IT", label: "Information Technology" },
  { key: "AI", label: "Artificial Intelligence" },
  { key: "CS", label: "Computer Science" },
  { key: "CH", label: "Chemical Engineering" },
  { key: "BT", label: "Biotechnology" },
]
export const groups = ["A", "B", "C", "Z"]
export const semesters = [1, 2, 3, 4, 5, 6, 7, 8]
export const days = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
]

export const CLUB_TYPES = [
  {
    value: "cultural",
    label: "Cultural",
    color: "from-pink-500 to-rose-500",
    icon: "🎭",
  },
  {
    value: "technical",
    label: "Technical",
    color: "from-blue-500 to-cyan-500",
    icon: "💻",
  },
  {
    value: "sports",
    label: "Sports",
    color: "from-green-500 to-emerald-500",
    icon: "⚽",
  },
  {
    value: "social",
    label: "Social",
    color: "from-purple-500 to-violet-500",
    icon: "🤝",
  },
]

export const clubTypeIcons: Record<string, any> = {
  technical: Code,
  cultural: Music,
  arts: Palette,
  academic: Book,
  social: Users,
  sports: Activity,
}

export const clubTypeColors: Record<string, string> = {
  technical: "from-purple-500/20 to-blue-500/20 border-purple-200/20",
  cultural: "from-rose-500/20 to-orange-500/20 border-rose-200/20",
  arts: "from-green-500/20 to-emerald-500/20 border-green-200/20",
  academic: "from-blue-500/20 to-cyan-500/20 border-blue-200/20",
  social: "from-yellow-500/20 to-orange-500/20 border-yellow-200/20",
  sports: "from-pink-500/20 to-purple-500/20 border-pink-200/20",
}

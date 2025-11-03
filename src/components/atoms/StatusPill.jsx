import { cn } from "@/utils/cn"

const StatusPill = ({ 
  status, 
  variant = "default", 
  className,
  onClick 
}) => {
  const statusConfig = {
    "Not Started": { color: "gray", bgColor: "bg-gray-100", textColor: "text-gray-800", borderColor: "border-gray-200" },
    "In Progress": { color: "blue", bgColor: "bg-status-blue/10", textColor: "text-status-blue", borderColor: "border-status-blue/20" },
    "Review": { color: "orange", bgColor: "bg-status-orange/10", textColor: "text-status-orange", borderColor: "border-status-orange/20" },
    "Done": { color: "green", bgColor: "bg-status-green/10", textColor: "text-status-green", borderColor: "border-status-green/20" },
    "Blocked": { color: "red", bgColor: "bg-status-red/10", textColor: "text-status-red", borderColor: "border-status-red/20" },
    "On Hold": { color: "yellow", bgColor: "bg-status-yellow/10", textColor: "text-yellow-800", borderColor: "border-status-yellow/20" },
    "High": { color: "red", bgColor: "bg-status-red/10", textColor: "text-status-red", borderColor: "border-status-red/20" },
    "Medium": { color: "orange", bgColor: "bg-status-orange/10", textColor: "text-status-orange", borderColor: "border-status-orange/20" },
    "Low": { color: "green", bgColor: "bg-status-green/10", textColor: "text-status-green", borderColor: "border-status-green/20" }
  }

  const config = statusConfig[status] || statusConfig["Not Started"]

  return (
    <span
      className={cn(
        "status-pill inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        onClick && "cursor-pointer hover:shadow-sm",
        className
      )}
      onClick={onClick}
    >
      {status}
    </span>
  )
}

export default StatusPill
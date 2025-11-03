import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const ViewTabs = ({ activeView, onViewChange, className }) => {
  const views = [
    { id: "table", label: "Table", icon: "Table" },
    { id: "kanban", label: "Kanban", icon: "Columns" },
    { id: "calendar", label: "Calendar", icon: "Calendar" },
    { id: "timeline", label: "Timeline", icon: "BarChart3" }
  ]

  return (
    <div className={cn("flex border-b border-gray-200 bg-white", className)}>
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200",
            "border-b-2 hover:bg-gray-50",
            activeView === view.id
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-gray-600 hover:text-gray-900"
          )}
        >
          <ApperIcon name={view.icon} className="w-4 h-4" />
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ViewTabs
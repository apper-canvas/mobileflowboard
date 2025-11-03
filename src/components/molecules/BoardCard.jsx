import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const BoardCard = ({ board, className }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/board/${board.Id}`)
  }

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden cursor-pointer",
        "transition-all duration-300 hover:-translate-y-1 hover:border-primary/20",
        className
      )}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
    >
      {/* Board Header */}
      <div className="h-32 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40" />
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <ApperIcon name="BarChart3" className="w-4 h-4 text-primary" />
          </div>
        </div>
        
        {/* Mini progress visualization */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex space-x-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full",
                  i < 5 ? "bg-accent/60" : "bg-white/40"
                )}
                style={{ width: `${12 + Math.random() * 8}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 font-display line-clamp-1">
{board.name}
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {board.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <ApperIcon name="FileText" className="w-3 h-3 mr-1" />
              {board.groups?.reduce((acc, group) => acc + group.items.length, 0) || 0} items
            </span>
            <span className="flex items-center">
              <ApperIcon name="Layers" className="w-3 h-3 mr-1" />
              {board.groups?.length || 0} groups
            </span>
          </div>
          <span>
            Updated {format(new Date(board.updatedAt), "MMM d")}
          </span>
        </div>

        {/* Team avatars */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {["John Doe", "Jane Smith", "Mike Johnson"].map((name, i) => {
              const initials = name.split(" ").map(n => n[0]).join("")
              const colors = ["bg-primary", "bg-secondary", "bg-accent"]
              return (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white",
                    colors[i % colors.length]
                  )}
                >
                  {initials}
                </div>
              )
            })}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
              +2
            </div>
          </div>

          <motion.button
            className="text-primary hover:text-primary-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default BoardCard
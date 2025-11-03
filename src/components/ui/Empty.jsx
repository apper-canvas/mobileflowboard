import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const Empty = ({ 
  icon = "FolderOpen",
  title = "No data found",
  message = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  className 
}) => {
  return (
    <motion.div 
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon 
          name={icon} 
          className="w-10 h-10 text-gray-400"
        />
      </motion.div>

      <motion.h3 
        className="text-2xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3 font-display"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      <motion.p 
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      )}

      <motion.div
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="text-xs text-gray-600">Start with templates</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <ApperIcon name="Users" className="w-6 h-6 text-accent mx-auto mb-2" />
          <p className="text-xs text-gray-600">Invite your team</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <ApperIcon name="Zap" className="w-6 h-6 text-secondary mx-auto mb-2" />
          <p className="text-xs text-gray-600">Automate workflows</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Empty
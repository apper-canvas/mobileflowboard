import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const Loading = ({ className }) => {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Board header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.div 
            className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundSize: "200% 100%" }}
          />
          <motion.div 
            className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <motion.div 
          className="h-10 w-32 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 rounded-lg"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      {/* View tabs skeleton */}
      <div className="flex space-x-4 border-b">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-lg"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 2, repeat: Infinity, delay: item * 0.1 }}
            style={{ backgroundSize: "200% 100%" }}
          />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-3">
        {/* Column headers */}
        <div className="grid grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <motion.div
              key={col}
              className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 2, repeat: Infinity, delay: col * 0.05 }}
              style={{ backgroundSize: "200% 100%" }}
            />
          ))}
        </div>

        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
          <motion.div
            key={row}
            className="grid grid-cols-6 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: row * 0.05, duration: 0.3 }}
          >
            {[1, 2, 3, 4, 5, 6].map((col) => (
              <motion.div
                key={col}
                className="h-14 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 2, repeat: Infinity, delay: (row * 6 + col) * 0.02 }}
                style={{ backgroundSize: "200% 100%" }}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Loading